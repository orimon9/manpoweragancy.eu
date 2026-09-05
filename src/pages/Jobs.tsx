import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Euro, MapPin, Search } from "lucide-react";
import { Seo, breadcrumbJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState, SectionHeading } from "@/components/ui/misc";
import { countries, jobs, programmes } from "@/content/site";
import { formatCurrency } from "@/lib/utils";

export default function Jobs() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("all");
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(() => Array.from(new Set(jobs.map((job) => job.category))).sort(), []);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);
      const matchesCountry = country === "all" || job.countrySlug === country;
      const matchesCategory = category === "all" || job.category === category;
      return matchesQuery && matchesCountry && matchesCategory;
    });
  }, [deferredQuery, country, category]);

  return (
    <>
      <Seo
        title="Opportunities"
        description="Explore universities and career opportunities across Europe with integrated visa support."
        path="/jobs"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Opportunities", path: "/jobs" },
        ])}
      />

      <PageHero
        eyebrow="Opportunities Portal"
        title="Find Your Perfect Opportunity"
        description="Explore universities and career opportunities across Europe with integrated visa support."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Opportunities", path: "/jobs" },
        ]}
      >
        <div className="mx-auto max-w-xl">
          <Label htmlFor="job-search" className="sr-only">
            Search opportunities
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="job-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jobs, employers, cities…"
              className="bg-white pl-10 text-foreground"
            />
          </div>
        </div>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">Career Opportunities</span>
              <h2 className="mt-4 text-display-sm">Work in Europe</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <div>
                <Label htmlFor="filter-country" className="sr-only">
                  Filter by country
                </Label>
                <Select id="filter-country" value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="all">All countries</option>
                  {countries.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-category" className="sr-only">
                  Filter by category
                </Label>
                <Select id="filter-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground" role="status" aria-live="polite">
            Showing {filtered.length} of {jobs.length} vacancies
          </p>

          {filtered.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                icon={<Briefcase className="h-5 w-5" />}
                title="No vacancies match those filters"
                description="Try widening your search, or submit your profile and we will match you as soon as a suitable role opens."
                action={
                  <Button asChild>
                    <Link to="/apply">Submit your profile</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {filtered.map((job) => (
                <Card key={job.slug} className="relative transition-shadow hover:shadow-e2">
                  <CardContent className="p-6 pt-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <Badge variant="soft">{job.employmentType}</Badge>
                      <Badge variant="accent">{job.tag}</Badge>
                    </div>
                    <h3 className="mt-4 text-lg">
                      <Link to={"/jobs/" + job.slug} className="after:absolute after:inset-0">
                        {job.title}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" aria-hidden />
                      {job.company}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal" aria-hidden />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-accent" aria-hidden />
                        {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section bg-secondary/50">
        <div className="container">
          <SectionHeading
            eyebrow="University Admissions"
            title="Study in Europe"
            description="Programmes we place students into, with admission and student visa support included."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {programmes.map((programme) => (
              <Card key={programme.title}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6 pt-6">
                  <div>
                    <Badge variant="teal">{programme.level}</Badge>
                    <h3 className="mt-3 text-lg">{programme.title}</h3>
                    <p className="text-sm text-muted-foreground">{programme.institution}</p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal" aria-hidden />
                        {programme.country}
                      </span>
                      <span className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-accent" aria-hidden />
                        {programme.fee}
                      </span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link to={"/apply?service=student-visa&programme=" + encodeURIComponent(programme.title)}>
                      Apply <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <h2 className="text-display-sm">Don&apos;t see what you&apos;re looking for?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Our team can help you find personalised opportunities that match your skills and aspirations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild variant="accent" size="lg">
                <Link to="/apply">Submit Your Profile</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Speak with Advisor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
