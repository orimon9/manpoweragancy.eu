import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { AppRole } from "@/lib/database.types";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  roles: AppRole[];
  loading: boolean;
  configured: boolean;
  signOut: () => Promise<void>;
  refreshRoles: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const mounted = useRef(true);

  const loadRoles = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (!mounted.current) return;
    if (error) {
      console.error("[auth] failed to load roles", error.message);
      setRoles([]);
      return;
    }
    setRoles((data ?? []).map((row) => row.role));
  }, []);

  useEffect(() => {
    mounted.current = true;

    if (!supabase) {
      setLoading(false);
      return () => {
        mounted.current = false;
      };
    }

    // 1. Register the listener FIRST so no auth event is missed.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        // 2. Never call Supabase directly inside the callback — defer it.
        setTimeout(() => {
          void loadRoles(nextSession.user.id);
        }, 0);
      } else {
        setRoles([]);
      }
      setLoading(false);
    });

    // 3. Only then read the existing session.
    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted.current) return;
      setSession(data.session);
      if (data.session?.user) {
        setTimeout(() => {
          void loadRoles(data.session!.user.id);
        }, 0);
      }
      setLoading(false);
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [loadRoles]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut({ scope: "global" });
    setSession(null);
    setRoles([]);
  }, []);

  const refreshRoles = useCallback(() => {
    if (session?.user) void loadRoles(session.user.id);
  }, [loadRoles, session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      roles,
      loading,
      configured: isSupabaseConfigured,
      signOut,
      refreshRoles,
    }),
    [session, roles, loading, signOut, refreshRoles]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function homePathForRoles(roles: AppRole[]) {
  if (roles.includes("admin") || roles.includes("staff")) return "/admin";
  if (roles.includes("employer")) return "/employer";
  return "/dashboard";
}
