import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

export default function Forbidden() {
  const { roles } = useAuth();

  return (
    <>
      <Seo title="Access denied" description="You do not have permission to view this area." path="/403" noindex />
      <section className="section">
        <div className="container flex min-h-[50vh] max-w-xl flex-col items-center justify-center text-center">
          <ShieldAlert className="h-12 w-12 text-warning" aria-hidden />
          <h1 className="mt-5 text-display-sm">You don&apos;t have access to this area</h1>
          <p className="mt-4 text-muted-foreground">
            Your account is signed in{roles.length ? " with the role " + roles.join(", ") : ""}, which does not include
            permission for this section. If you believe this is wrong, contact your account manager.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/dashboard">Go to my dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
