import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, Briefcase, CalendarDays, CheckCircle2, Euro, MapPin, Users } from "lucide-react";
import { Seo, breadcrumbJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { countries, jobs } from "@/content/site";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function JobDetail() {
  const { slug } = useParams();
  const job = jobs.find((item) => item.slug === slug);

  if (!job) return <Navigate to="/404" replace />;

  const country = countries.find((item) => item.slug === job.countrySlug);

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: "2026-09-01",
    validThrough: job.deadline,
    employmentType: job.employmentType.toUpperCase().replace("-", "_"),
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: country?.iso2 ?? "RO" },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: job.currency,
      value: { "@type": "QuantitativeValue", minValue: job.salaryMin, maxValue: job.salaryMax, unitText: "YEAR" },
    },
    totalJobOpenings: job.vacancies,
  };

  return (
    <>
      <Seo
        title={job.title + " — " + job.location}
        description={job.description}
        path={"/jobs/" + job.slug}
        type="article"
        jsonLd={[
          jobPostingJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Opportunities", path: "/jobs" },
            { name: job.title, path: "/jobs/" + job.slug },
          ]),
        ]}
      />

      <PageHero
        eyebrow={job.tag}
        title={job.title}
        description={job.company + " · " + job.location}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Opportunities", path: "/jobs" },
          { name: job.title, path: "/jobs/" + job.slug },
        ]}
      />

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="text-lg text-muted-foreground">{job.description}</p>

            <h2 className="mt-10 text-xl">Responsibilities</h2>
            <ul className="mt-4 space-y-2">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex gap-3 text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-xl">Requirements</h2>
            <ul className="mt-4 space-y-2">
              {job.requirements.map((item) => (
                <li key={item} className="flex gap-3 text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-xl">Benefits</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {job.benefits.map((item) => (
                <li key={item}>
                  <Badge variant="soft" className="px-3 py-1.5 text-sm">
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>

            {country ? (
              <div className="mt-12 rounded-lg border border-border bg-secondary/50 p-6">
                <h2 className="text-base">
                  Visa route for {country.name} <span aria-hidden>{country.flag}</span>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{country.summary}</p>
                <Button asChild variant="link" className="mt-2 px-0">
                  <Link to={"/countries/" + country.slug}>
                    See requirements and processing times <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Card>
              <CardContent className="p-7 pt-7">
                <dl className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Euro className="h-4 w-4 text-accent" aria-hidden />
                    <div>
                      <dt className="text-muted-foreground">Salary</dt>
                      <dd className="font-semibold">
                        {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)} / year
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-teal" aria-hidden />
                    <div>
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="font-semibold">{job.location}</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-primary" aria-hidden />
                    <div>
                      <dt className="text-muted-foreground">Experience</dt>
                      <dd className="font-semibold">
                        {job.experienceRequired === 0 ? "No experience required" : job.experienceRequired + "+ years"}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-primary" aria-hidden />
                    <div>
                      <dt className="text-muted-foreground">Vacancies</dt>
                      <dd className="font-semibold">{job.vacancies}</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-destructive" aria-hidden />
                    <div>
                      <dt className="text-muted-foreground">Apply before</dt>
                      <dd className="font-semibold">{formatDate(job.deadline)}</dd>
                    </div>
                  </div>
                </dl>

                <Button asChild className="mt-7 w-full" variant="accent" size="lg">
                  <Link to={"/apply?job=" + job.slug}>
                    Apply for this role <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Free to apply. We never charge candidates a placement fee.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
