import { Link } from "react-router-dom";
import { Clock, Euro } from "lucide-react";
import { Seo, breadcrumbJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { countries } from "@/content/site";

export default function Countries() {
  const eu = countries.filter((country) => country.isEu);
  const nonEu = countries.filter((country) => !country.isEu);

  return (
    <>
      <Seo
        title="Destination Countries"
        description="Work, study and residency routes across Romania, the EU, the Gulf and North America — with processing times and requirements."
        path="/countries"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Countries", path: "/countries" },
        ])}
      />

      <PageHero
        eyebrow="Destinations"
        title="Where We Can Take You"
        description="Twelve destination countries, each with its own routes, processing times and documentary requirements."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Countries", path: "/countries" },
        ]}
      />

      {[
        { title: "European Union", list: eu },
        { title: "Beyond Europe", list: nonEu },
      ].map((group) => (
        <section key={group.title} className="section">
          <div className="container">
            <h2 className="text-display-sm">{group.title}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.list.map((country) => (
                <Card key={country.slug} className="relative transition-shadow hover:shadow-e2">
                  <CardContent className="p-6 pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl" aria-hidden>
                        {country.flag}
                      </span>
                      <Badge variant={country.isEu ? "teal" : "soft"}>{country.region}</Badge>
                    </div>
                    <h3 className="mt-4 text-lg">
                      <Link to={"/countries/" + country.slug} className="after:absolute after:inset-0">
                        {country.name}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{country.summary}</p>
                    <dl className="mt-5 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-teal" aria-hidden />
                        <dt className="sr-only">Processing time</dt>
                        <dd>{country.processingTime}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-accent" aria-hidden />
                        <dt className="sr-only">Typical salary</dt>
                        <dd>{country.salaryRange}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
