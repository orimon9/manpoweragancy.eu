import { Link } from "react-router-dom";
import { ArrowRight, Award, CheckCircle2, Shield, Users } from "lucide-react";
import { Seo, breadcrumbJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { company, services } from "@/content/site";
import { formatCurrency } from "@/lib/utils";

export default function Services() {
  return (
    <>
      <Seo
        title="Visa & Immigration Services"
        description="Work permits, student visas, business and investor visas, family reunification, TRC extensions, permanent residency and non-EU services."
        path="/services"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <PageHero
        eyebrow="Immigration Solutions"
        title="Visa & Immigration Services"
        description="From work permits to citizenship, we provide expert guidance for every step of your immigration journey to Romania and the EU."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />

      <section className="section">
        <div className="container grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <Card key={service.slug} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col p-7 pt-7">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-teal-soft text-teal">
                    <Icon name={service.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl">{service.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>

                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-4 pt-1">
                  <Button asChild>
                    <Link to={"/apply?service=" + service.slug}>
                      Apply Now <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to={"/services/" + service.slug}>Details</Link>
                  </Button>
                  {service.priceFrom ? (
                    <span className="text-sm text-muted-foreground">
                      Service fee from <strong className="text-foreground">{formatCurrency(service.priceFrom)}</strong>
                    </span>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/50 py-12">
        <div className="container flex flex-wrap items-center justify-center gap-x-14 gap-y-6 text-sm font-medium">
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal" aria-hidden /> EU Certified
          </span>
          <span className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" aria-hidden /> {company.stats.successRate} Success Rate
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" aria-hidden /> {company.stats.clients} Clients
          </span>
        </div>
      </section>
    </>
  );
}
