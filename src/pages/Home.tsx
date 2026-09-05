import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, Quote, Star } from "lucide-react";
import { Seo, breadcrumbJsonLd, organizationJsonLd } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/misc";
import { Icon } from "@/components/Icon";
import { company, processSteps, services, testimonials, whyUs } from "@/content/site";

const heroPoints = ["EU Certified Immigration Experts", "Fast-Track Processing Available", "24/7 Application Support"];

export default function Home() {
  return (
    <>
      <Seo
        title={company.name}
        description="Expert work visa, study visa and immigration guidance for Romania, the EU and worldwide. 15+ years, 50,000+ clients, 98% approval rate."
        path="/"
        jsonLd={[organizationJsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }])]}
      />

      {/* Hero ---------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-brand-gradient text-brand-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px, 64px 64px",
          }}
          aria-hidden
        />
        <div className="container relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
              Trusted by {company.stats.clients} clients worldwide
            </span>

            <h1 className="mt-7 text-display-lg text-brand-foreground">
              Your Trusted Partner for{" "}
              <span className="text-accent">Work Visa</span>,{" "}
              <span className="text-brand-highlight">Study Visa</span> &amp; Global Opportunities
            </h1>

            <p className="mt-6 max-w-xl text-lg text-brand-foreground/80">
              Navigate your immigration journey with confidence. Expert guidance for Romania, EU, and worldwide visa
              applications.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {heroPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-brand-foreground/90">
                  <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" variant="accent">
                <Link to="/apply">
                  Apply Now <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="onDark">
                <Link to="/track">Track Your Application</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 self-center">
            {[
              { value: company.stats.successRate, label: "Visa approval rate" },
              { value: company.stats.years, label: "Years of experience" },
              { value: company.stats.clients, label: "Clients served" },
              { value: company.stats.countries, label: "Countries covered" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/15 bg-white/10 p-6 backdrop-blur">
                <p className="font-display text-3xl font-bold text-brand-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-brand-foreground/75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services ------------------------------------------------------ */}
      <section className="section bg-secondary/50">
        <div className="container">
          <SectionHeading
            eyebrow="Our Services"
            title="Comprehensive Visa & Immigration Solutions"
            description="From work permits to permanent residency, we provide end-to-end immigration services tailored to your needs."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services
              .filter((service) => service.featured)
              .slice(0, 8)
              .map((service) => (
                <Card key={service.slug} className="transition-shadow hover:shadow-e2">
                  <CardContent className="p-6 pt-6">
                    <span className="grid h-12 w-12 place-items-center rounded-md bg-teal-soft text-teal">
                      <Icon name={service.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-lg">
                      <Link to={"/services/" + service.slug} className="after:absolute after:inset-0">
                        {service.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">{service.shortDescription}</p>
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/services">
                View All Services <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process ------------------------------------------------------- */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="How It Works"
            title="Simple 5-Step Visa Process"
            description="Our streamlined process ensures a smooth journey from application to approval."
          />

          <ol className="mt-16 grid gap-10 md:grid-cols-5">
            {processSteps.map((item, index) => (
              <li key={item.step} className="relative text-center">
                {index < processSteps.length - 1 ? (
                  <span
                    className="absolute left-1/2 top-7 hidden h-px w-full bg-gradient-to-r from-primary to-accent md:block"
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full border border-border bg-card font-display font-bold text-primary shadow-e1">
                  {index === 0 ? <CheckCircle2 className="h-6 w-6 text-teal" aria-hidden /> : item.step}
                </span>
                <h3 className="mt-5 text-base">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why us -------------------------------------------------------- */}
      <section className="section bg-brand-gradient text-brand-foreground">
        <div className="container">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Your Success Is Our Priority"
            description="We combine expertise, technology, and personalised service to deliver exceptional immigration solutions."
            tone="dark"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/15 bg-white/5 p-7 backdrop-blur">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-white/10 text-accent">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg text-brand-foreground">{item.title}</h3>
                <p className="mt-3 text-sm text-brand-foreground/75">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials -------------------------------------------------- */}
      <section className="section bg-secondary/50">
        <div className="container">
          <SectionHeading
            eyebrow="Client Success Stories"
            title="What Our Clients Say"
            description="Join thousands of satisfied clients who achieved their immigration goals with our expert guidance."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <Card key={item.name} className="border-l-4 border-l-primary">
                <CardContent className="p-7 pt-7">
                  <Quote className="h-8 w-8 text-border" aria-hidden />
                  <blockquote className="mt-4 text-foreground">{item.quote}</blockquote>
                  <div className="mt-5 flex gap-1" aria-label={item.rating + " out of 5 stars"}>
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden />
                    ))}
                  </div>
                  <figcaption className="mt-6 flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary font-semibold text-primary">
                      {item.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span>
                      <span className="block font-display font-bold">{item.name}</span>
                      <span className="block text-sm text-muted-foreground">{item.role}</span>
                      <span className="block text-sm text-teal">{item.route}</span>
                    </span>
                  </figcaption>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA ----------------------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="rounded-2xl bg-brand-gradient px-6 py-16 text-center text-brand-foreground md:px-16">
            <h2 className="mx-auto max-w-2xl text-display-md text-brand-foreground">Ready to Start Your Immigration Journey?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-brand-foreground/80">
              Take the first step towards your new life. Our expert team is ready to guide you through every stage of the
              visa process.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="accent">
                <Link to="/apply">
                  Apply Now <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="onDark">
                <Link to="/contact">
                  <MessageCircle className="h-4 w-4" aria-hidden /> Book Consultation
                </Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-brand-foreground/75">
              Or WhatsApp call us at{" "}
              <a className="font-semibold text-accent hover:underline" href={"https://wa.me/" + company.whatsapp.replace(/[^0-9]/g, "")}>
                {company.phones[1]}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
