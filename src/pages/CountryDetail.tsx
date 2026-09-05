import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Euro } from "lucide-react";
import { Seo, breadcrumbJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { countries, jobs } from "@/content/site";
import { formatCurrency } from "@/lib/utils";

export default function CountryDetail() {
  const { slug } = useParams();
  const country = countries.find((item) => item.slug === slug);

  if (!country) return <Navigate to="/404" replace />;

  const openRoles = jobs.filter((job) => job.countrySlug === country.slug);

  return (
    <>
      <Seo
        title={"Immigration to " + country.name}
        description={country.summary}
        path={"/countries/" + country.slug}
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Countries", path: "/countries" },
          { name: country.name, path: "/countries/" + country.slug },
        ])}
      />

      <PageHero
        eyebrow={country.region + (country.isEu ? " · EU member" : "")}
        title={"Immigration to " + country.name}
        description={country.summary}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Countries", path: "/countries" },
          { name: country.name, path: "/countries/" + country.slug },
        ]}
      />

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-display-sm">Visa types</h2>
            <div className="mt-6 space-y-4">
              {country.visaTypes.map((visa) => (
                <Card key={visa.name}>
                  <CardContent className="p-6 pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg">{visa.name}</h3>
                      <Badge variant="soft">{visa.category}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{visa.note}</p>
                    <p className="mt-4 flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-teal" aria-hidden />
                      Typical processing: <strong>{visa.processingTime}</strong>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="mt-12 text-display-sm">Core requirements</h2>
            <ul className="mt-6 space-y-3">
              {country.requirements.map((requirement) => (
                <li key={requirement} className="flex gap-3 rounded-md border border-border bg-card p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden />
                  <span className="text-sm">{requirement}</span>
                </li>
              ))}
            </ul>

            {openRoles.length > 0 ? (
              <>
                <h2 className="mt-12 text-display-sm">Open vacancies in {country.name}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {openRoles.map((job) => (
                    <Card key={job.slug} className="relative transition-shadow hover:shadow-e2">
                      <CardContent className="p-5 pt-5">
                        <h3 className="text-base">
                          <Link to={"/jobs/" + job.slug} className="after:absolute after:inset-0">
                            {job.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
                        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <Euro className="h-4 w-4 text-accent" aria-hidden />
                          {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Card>
              <CardContent className="p-7 pt-7">
                <dl className="space-y-5 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Overall processing time</dt>
                    <dd className="mt-1 font-display text-xl">{country.processingTime}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Typical salary range</dt>
                    <dd className="mt-1 font-display text-xl">{country.salaryRange}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="mt-1">
                      <Badge variant={country.isEu ? "teal" : "soft"}>{country.isEu ? "EU member state" : "Non-EU"}</Badge>
                    </dd>
                  </div>
                </dl>
                <Button asChild className="mt-7 w-full" variant="accent">
                  <Link to={"/apply?country=" + country.slug}>
                    Start an application <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
