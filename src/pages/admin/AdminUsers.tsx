import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/misc";
import { requireSupabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import type { AppRole } from "@/lib/database.types";

const ROLES: AppRole[] = ["candidate", "employer", "staff", "admin"];

export default function AdminUsers() {
  const { roles: myRoles, user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = myRoles.includes("admin");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "user-roles"],
    queryFn: async () => {
      const supabase = requireSupabase();
      const [rolesResult, profilesResult] = await Promise.all([
        supabase.from("user_roles").select("*"),
        supabase.from("profiles").select("user_id, full_name, email"),
      ]);
      if (rolesResult.error) throw rolesResult.error;
      if (profilesResult.error) throw profilesResult.error;

      const byUser = new Map<string, { user_id: string; full_name: string | null; email: string | null; roles: AppRole[] }>();
      for (const profile of profilesResult.data ?? []) {
        byUser.set(profile.user_id, { ...profile, roles: [] });
      }
      for (const row of rolesResult.data ?? []) {
        const entry = byUser.get(row.user_id) ?? { user_id: row.user_id, full_name: null, email: null, roles: [] };
        entry.roles.push(row.role);
        byUser.set(row.user_id, entry);
      }
      return Array.from(byUser.values());
    },
  });

  const toggleRole = async (userId: string, role: AppRole, has: boolean) => {
    if (userId === user?.id && role === "admin" && has) {
      toast.error("You cannot remove your own admin role");
      return;
    }
    if (!window.confirm((has ? "Revoke" : "Grant") + " the " + role + " role?")) return;

    try {
      const supabase = requireSupabase();
      if (has) {
        const { error: deleteError } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (insertError) throw insertError;
      }
      await queryClient.invalidateQueries({ queryKey: ["admin", "user-roles"] });
      toast.success("Roles updated");
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-display-sm">Users &amp; roles</h1>
        <p className="mt-2 text-muted-foreground">
          Roles live in the <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">user_roles</code> table, never on
          profiles, and are checked through a SECURITY DEFINER function.
        </p>
      </header>

      {!isAdmin ? (
        <Alert variant="warning">
          <AlertTitle>Read-only</AlertTitle>
          <AlertDescription>Only administrators can grant or revoke roles. The database enforces this, not just this page.</AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error instanceof Error ? error.message : "Could not load users"}
        </p>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="space-y-3">
          {(data ?? []).map((row) => (
            <Card key={row.user_id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5 pt-5">
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.full_name ?? "Unnamed user"}</p>
                  <p className="truncate text-sm text-muted-foreground">{row.email ?? row.user_id}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {row.roles.length ? (
                      row.roles.map((role) => (
                        <Badge key={role} variant={role === "admin" ? "default" : "soft"}>
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">no roles</Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ROLES.map((role) => {
                    const has = row.roles.includes(role);
                    return (
                      <Button
                        key={role}
                        size="sm"
                        variant={has ? "secondary" : "outline"}
                        disabled={!isAdmin}
                        onClick={() => void toggleRole(row.user_id, role, has)}
                      >
                        {has ? "Revoke " : "Grant "}
                        {role}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
