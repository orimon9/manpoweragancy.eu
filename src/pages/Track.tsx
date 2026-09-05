import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/database.types";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

type Result = { reference_code: string; status: ApplicationStatus; status_changed_at: string | null } | null;

const REFERENCE_PATTERN = /^MGA-\d{4}-\d{6}$/i;

export default function Track() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResult(null);
    setError(null);

    const value = code.trim().toUpperCase();
    if (!REFERENCE_PATTERN.test(value)) {
      setError("Reference codes look like MGA-2026-000123. Check the code in your confirmation email.");
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // RLS: an anonymous visitor cannot read applications. Signing in is required.
        const { data, error: queryError } = await supabase
          .from("applications")
          .select("reference_code, status, status_changed_at")
          .eq("reference_code", value)
          .maybeSingle();

        if (queryError) throw queryError;
        if (!data) {
          setError("We could not find that reference on your account. Sign in with the email you applied with.");
        } else {
          setResult(data as Result);
        }
      } else {
        setError("Tracking needs the Supabase backend connected. See the deployment notes in the README.");
      }
    } catch (queryError) {
      setError(queryError instanceof Error ? queryError.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Track Your Application"
        description="Check the live status of your visa application using your MGA reference code."
        path="/track"
      />

      <PageHero
        eyebrow="Application Tracking"
        title="Track Your Application"
        description="Enter the reference code from your confirmation email to see where your file stands."
      />

      <section className="section">
        <div className="container max-w-2xl">
          <Card>
            <CardContent className="p-8 pt-8">
              <form onSubmit={onSubmit} noValidate>
                <Label htmlFor="reference">Reference code</Label>
                <div className="mt-2 flex gap-3">
                  <Input
                    id="reference"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="MGA-2026-000123"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <Button type="submit" disabled={loading}>
                    <Search className="h-4 w-4" aria-hidden />
                    {loading ? "Checking…" : "Track"}
                  </Button>
                </div>
              </form>

              <div aria-live="polite">
                {error ? (
                  <Alert variant="warning" className="mt-6">
                    <AlertTitle>Not found</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                {result ? (
                  <Alert variant="success" className="mt-6">
                    <AlertTitle>{result.reference_code}</AlertTitle>
                    <AlertDescription>
                      Current status: <strong>{APPLICATION_STATUS_LABELS[result.status]}</strong>
                      {result.status_changed_at ? " · updated " + formatDate(result.status_changed_at) : null}
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>

              <p className="mt-8 text-sm text-muted-foreground">
                For the full status timeline, outstanding documents and appointments,{" "}
                <Link to="/dashboard" className="text-primary underline">
                  sign in to your dashboard
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
