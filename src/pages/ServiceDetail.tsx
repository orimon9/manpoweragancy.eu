import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Seo, breadcrumbJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { faqs, processSteps, services } from "@/content/site";
import { formatCurrency } from "@/lib/utils";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);

  if (!service) return <Navigate to="/404" replace />;

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <Seo
        title={service.title}
        description={service.shortDescription}
        path={"/services/" + service.slug}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: "/services/" + service.slug },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.description,
            areaServed: "EU",
            provider: { "@type": "Organization", name: "Manpower Global Agency SRL" },
          },
        ]}
      />

      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.shortDescription}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: "/services/" + service.slug },
        ]}
      />

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-display-sm">What this service covers</h2>
            <p className="mt-5 text-lg text-muted-foreground">{service.description}</p>

            <h3 className="mt-12 text-xl">Included in the service</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-12 text-xl">How the process runs</h3>
            <ol className="mt-5 space-y-4">
              {processSteps.map((step) => (
                <li key={step.step} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-sm font-bold text-primary">
                    {step.step}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h3 className="mt-12 text-xl">Common questions</h3>
            <dl className="mt-5 divide-y divide-border rounded-lg border border-border bg-card">
              {faqs.slice(0, 4).map((faq) => (
                <div key={faq.question} className="p-6">
                  <dt className="font-semibold">{faq.question}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Card>
              <CardContent className="p-7 pt-7">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-teal-soft text-teal">
                  <Icon name={service.icon} className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-lg">Start your {service.title.toLowerCase()}</h2>
                {service.priceFrom ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Service fee from{" "}
                    <strong className="font-display text-2xl text-foreground">{formatCurrency(service.priceFrom)}</strong>
                    <br />
                    Government and embassy fees are charged separately, at cost.
                  </p>
                ) : null}
                <Button asChild className="mt-6 w-full" variant="accent">
                  <Link to={"/apply?service=" + service.slug}>
                    Apply Now <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild className="mt-3 w-full" variant="outline">
                  <Link to="/contact">Book a consultation</Link>
                </Button>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Related services</h2>
              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={"/services/" + item.slug}
                      className="block rounded-md border border-border bg-card p-4 transition-colors hover:bg-secondary"
                    >
                      <span className="font-semibold">{item.title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{item.shortDescription}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
