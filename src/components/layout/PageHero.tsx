import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: { name: string; path: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-brand-gradient text-brand-foreground">
      <div className="container py-16 text-center md:py-20">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-1 text-sm text-brand-foreground/70">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-1">
                  {index > 0 ? <ChevronRight className="h-3.5 w-3.5" aria-hidden /> : null}
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page" className="text-brand-foreground">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link to={crumb.path} className="hover:text-brand-foreground">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? (
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-accent">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mx-auto mt-5 max-w-4xl text-display-md text-brand-foreground">{title}</h1>
        {description ? <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-foreground/80">{description}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
