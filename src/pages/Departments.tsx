import { Seo, breadcrumbJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/misc";
import { Icon } from "@/components/Icon";
import { departments, sisterConcerns } from "@/content/site";

export default function Departments() {
  return (
    <>
      <Seo
        title="Departments"
        description="Beyond immigration: travel and support services, corporate and legal solutions, and our wider business portfolio."
        path="/departments"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Departments", path: "/departments" },
        ])}
      />

      <PageHero
        eyebrow="Our Departments"
        title="Comprehensive Business Solutions"
        description="Beyond immigration, we offer a full suite of services to support your journey and business in Europe."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Departments", path: "/departments" },
        ]}
      />

      {departments.map((department, index) => (
        <section key={department.title} className={index % 2 === 0 ? "section" : "section bg-secondary/50"}>
          <div className="container">
            <SectionHeading eyebrow={department.eyebrow} title={department.title} description={department.description} />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {department.items.map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-6 pt-6">
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-teal-soft text-teal">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-base">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Sister Concerns"
            title="Our Business Portfolio"
            description="A diversified group of companies serving various industries."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {sisterConcerns.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5 pt-5 text-center">
                  <span className="mx-auto grid h-10 w-10 place-items-center rounded-md bg-accent-soft text-accent">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 text-sm">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
