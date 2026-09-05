import { useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, FieldError } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { homePathForRoles, useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup" | "reset";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

const signUpSchema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
});

const resetSchema = z.object({ email: z.string().email("Enter a valid email address") });

/** Maps Supabase auth errors onto messages a person can act on. */
function friendlyAuthError(message: string) {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) return "That email and password combination is not recognised.";
  if (text.includes("email not confirmed")) return "Please confirm your email first — check your inbox for our link.";
  if (text.includes("already registered") || text.includes("user already")) return "An account with this email already exists. Try signing in.";
  if (text.includes("rate limit") || text.includes("too many")) return "Too many attempts. Wait a minute and try again.";
  if (text.includes("password")) return "That password does not meet the minimum requirements.";
  return message;
}

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

export default function AuthPage() {
  const [params] = useSearchParams();
  const { user, roles, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [notice, setNotice] = useState<string | null>(null);

  const redirectTo = params.get("redirectTo");

  const schema = useMemo(() => (mode === "signin" ? signInSchema : mode === "signup" ? signUpSchema : resetSchema), [mode]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ full_name?: string; email: string; password?: string }>({
    resolver: zodResolver(schema as never),
  });

  const password = watch("password") ?? "";
  const score = passwordScore(password);

  if (!loading && user) {
    return <Navigate to={redirectTo ? decodeURIComponent(redirectTo) : homePathForRoles(roles)} replace />;
  }

  const switchMode = (next: Mode) => {
    setMode(next);
    setNotice(null);
    reset();
  };

  const onSubmit = async (values: { full_name?: string; email: string; password?: string }) => {
    if (!supabase) {
      setNotice("Supabase is not connected yet, so sign-in is disabled in this build.");
      return;
    }

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password! });
        if (error) throw error;
        toast.success("Signed in");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password!,
          options: {
            emailRedirectTo: window.location.origin + "/auth",
            data: { full_name: values.full_name },
          },
        });
        if (error) throw error;
        setNotice("Check your inbox — we sent a confirmation link to " + values.email + ".");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: window.location.origin + "/auth",
        });
        if (error) throw error;
        setNotice("If that email is registered, a password reset link is on its way.");
      }
    } catch (error) {
      const message = error instanceof Error ? friendlyAuthError(error.message) : "Authentication failed";
      toast.error(message);
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + (redirectTo ? decodeURIComponent(redirectTo) : "/dashboard") },
    });
    if (error) toast.error(friendlyAuthError(error.message));
  };

  return (
    <>
      <Seo title="Sign in" description="Sign in to track your application, upload documents and message your consultant." path="/auth" noindex />

      <PageHero eyebrow="Client Portal" title="Sign in to your account" description="Track your application, upload documents and talk to your consultant." />

      <section className="section">
        <div className="container max-w-md">
          <Card>
            <CardContent className="p-8 pt-8">
              <div className="grid grid-cols-3 gap-1 rounded-md bg-secondary p-1" role="tablist" aria-label="Authentication mode">
                {(
                  [
                    ["signin", "Sign in"],
                    ["signup", "Register"],
                    ["reset", "Reset"],
                  ] as [Mode, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={mode === value}
                    onClick={() => switchMode(value)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      mode === value ? "bg-card text-foreground shadow-e1" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {!isSupabaseConfigured ? (
                <Alert variant="warning" className="mt-6">
                  <AlertTitle>Backend not connected</AlertTitle>
                  <AlertDescription>
                    Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then run the SQL migrations in
                    supabase/migrations.
                  </AlertDescription>
                </Alert>
              ) : null}

              {notice ? (
                <Alert variant="info" className="mt-6" role="status">
                  <AlertDescription>{notice}</AlertDescription>
                </Alert>
              ) : null}

              <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                {mode === "signup" ? (
                  <div>
                    <Label htmlFor="full_name">Full name</Label>
                    <Input id="full_name" className="mt-2" autoComplete="name" {...register("full_name")} />
                    <FieldError>{errors.full_name?.message}</FieldError>
                  </div>
                ) : null}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" className="mt-2" autoComplete="email" {...register("email")} />
                  <FieldError>{errors.email?.message}</FieldError>
                </div>

                {mode !== "reset" ? (
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      className="mt-2"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      {...register("password")}
                    />
                    <FieldError>{errors.password?.message}</FieldError>

                    {mode === "signup" && password ? (
                      <div className="mt-3">
                        <div className="flex gap-1" aria-hidden>
                          {[0, 1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className={cn(
                                "h-1.5 flex-1 rounded-full",
                                i < score ? (score <= 1 ? "bg-destructive" : score === 2 ? "bg-warning" : "bg-success") : "bg-border"
                              )}
                            />
                          ))}
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Password strength: {["very weak", "weak", "fair", "good", "strong"][score]}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
                </Button>
              </form>

              {mode !== "reset" ? (
                <>
                  <div className="my-6 flex items-center gap-4">
                    <span className="h-px flex-1 bg-border" aria-hidden />
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
                    <span className="h-px flex-1 bg-border" aria-hidden />
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={signInWithGoogle} disabled={!isSupabaseConfigured}>
                    Continue with Google
                  </Button>
                </>
              ) : null}

              <p className="mt-6 text-center text-xs text-muted-foreground">
                By continuing you agree to our{" "}
                <Link to="/terms" className="underline">
                  terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline">
                  privacy policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
