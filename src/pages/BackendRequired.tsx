import { Link } from "react-router-dom";
import { Database } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  "Create a Supabase project and copy its URL and anon key.",
  "Copy .env.example to .env.local and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  "Run supabase/migrations/0001_schema.sql, then 0002_rls.sql, then 0003_seed.sql in the SQL editor.",
  "Create the documents (private), avatars (public) and media (public) storage buckets.",
  "Deploy the edge functions in supabase/functions and set the RESEND_API_KEY secret.",
  "Restart the dev server — the portal areas unlock automatically.",
];

export default function BackendRequired() {
  return (
    <>
      <Seo title="Backend not connected" description="This area needs the Supabase backend." path="/backend-required" noindex />
      <section className="section">
        <div className="container max-w-2xl">
          <Card>
            <CardContent className="p-8 pt-8">
              <Database className="h-10 w-10 text-primary" aria-hidden />
              <h1 className="mt-5 text-display-sm">The client portal needs Supabase</h1>
              <p className="mt-4 text-muted-foreground">
                The public site runs on bundled content, but dashboards, document upload and application tracking read and
                write real data. Connect the backend to unlock them.
              </p>
              <ol className="mt-8 space-y-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/">Back to the site</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">Contact us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
