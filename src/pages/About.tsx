import { Seo, breadcrumbJsonLd, organizationJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/misc";
import { Icon } from "@/components/Icon";
import { company, timeline, values } from "@/content/site";

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="15+ years of excellence helping individuals and businesses navigate global immigration from our Bucharest headquarters."
        path="/about"
        jsonLd={[
          organizationJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="About Us"
        title="Your Trusted Immigration Partner"
        description="15+ years of excellence in helping individuals and businesses navigate global immigration."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ]}
      />

      <section className="section">
        <div className="container grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-8 pt-8">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-soft text-primary">
                <Icon name="target" className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl">Our Mission</h2>
              <p className="mt-3 text-muted-foreground">
                To simplify the immigration journey for individuals and businesses worldwide, providing expert guidance,
                transparent processes, and unwavering support at every step.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8 pt-8">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
                <Icon name="eye" className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl">Our Vision</h2>
              <p className="mt-3 text-muted-foreground">
                To be the most trusted immigration partner in Europe, known for our expertise, integrity, and commitment
                to turning immigration dreams into reality.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section bg-secondary/50">
        <div className="container">
          <SectionHeading eyebrow="Our Values" title="What Drives Us" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 pt-6 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-teal-soft text-teal">
                    <Icon name={value.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Our Journey" title={company.stats.years + " Years of Excellence"} />
          <ol className="mx-auto mt-14 max-w-2xl">
            {timeline.map((item, index) => (
              <li key={item.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                    {item.year}
                  </span>
                  {index < timeline.length - 1 ? <span className="w-px flex-1 bg-border" aria-hidden /> : null}
                </div>
                <div className="pb-10 pt-2">
                  <h3 className="text-base">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-secondary/50">
        <div className="container">
          <SectionHeading
            eyebrow="Registered & Regulated"
            title="A Romanian company, operating under EU law"
            description="We are registered in Bucharest and process every client file under the GDPR. Our consultants are licensed to represent applicants before the Romanian General Inspectorate for Immigration."
          />
          <dl className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <dt className="text-sm text-muted-foreground">Legal entity</dt>
              <dd className="mt-2 font-display text-lg">{company.legalName}</dd>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <dt className="text-sm text-muted-foreground">Registration</dt>
              <dd className="mt-2 font-display text-lg">{company.regNumber}</dd>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <dt className="text-sm text-muted-foreground">Head office</dt>
              <dd className="mt-2 font-display text-lg">
                {company.address.city}, {company.address.country}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
