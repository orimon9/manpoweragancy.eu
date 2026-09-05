import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you were looking for does not exist." path="/404" noindex />
      <section className="section">
        <div className="container flex min-h-[50vh] max-w-xl flex-col items-center justify-center text-center">
          <p className="font-display text-6xl font-bold text-primary">404</p>
          <h1 className="mt-4 text-display-sm">This page has moved on</h1>
          <p className="mt-4 text-muted-foreground">
            The page you were looking for does not exist. It may have been renamed, or the link that brought you here may be
            out of date.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
