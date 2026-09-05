import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Seo, breadcrumbJsonLd, organizationJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select, Textarea, FieldError } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { company, countries, services } from "@/content/site";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const schema = z.object({
  full_name: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().max(40).optional().or(z.literal("")),
  country_of_interest: z.string().optional().or(z.literal("")),
  service_of_interest: z.string().optional().or(z.literal("")),
  message: z.string().min(20, "Please give us at least a sentence or two (20 characters)").max(4000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you accept the privacy policy" }) }),
  // Honeypot: real people never fill this in.
  company_website: z.string().max(0).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (values.company_website) return; // honeypot tripped — silently drop

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.functions.invoke("contact-inquiry", {
          body: {
            full_name: values.full_name,
            email: values.email,
            phone: values.phone || null,
            country_of_interest: values.country_of_interest || null,
            service_of_interest: values.service_of_interest || null,
            message: values.message,
            source: "website_contact_form",
          },
        });
        if (error) throw error;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setSent(true);
      reset();
      toast.success("Message sent", { description: "We reply to every enquiry within one working day." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error("Could not send your message", { description: message });
    }
  };

  return (
    <>
      <Seo
        title="Contact"
        description="Talk to our Bucharest team about work visas, study visas, family reunification and residency. We reply within one working day."
        path="/contact"
        jsonLd={[
          organizationJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Get In Touch"
        title="Contact Our Team"
        description="Tell us where you want to go and we will tell you exactly what it takes to get there."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-display-sm">Send Us a Message</h2>
            <p className="mt-4 text-muted-foreground">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

            {sent ? (
              <div className="mt-8 rounded-lg border border-success/30 bg-success/10 p-6" role="status" aria-live="polite">
                <p className="font-semibold">Thank you — your message is with our team.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  A consultant will reply to your email within one working day. For anything urgent, WhatsApp us on{" "}
                  {company.phones[1]}.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input id="full_name" className="mt-2" placeholder="John Doe" autoComplete="name" {...register("full_name")} />
                    <FieldError>{errors.full_name?.message}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-2"
                      placeholder="john@example.com"
                      autoComplete="email"
                      {...register("email")}
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" className="mt-2" placeholder="+40 123 456 789" autoComplete="tel" {...register("phone")} />
                    <FieldError>{errors.phone?.message}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="country_of_interest">Destination</Label>
                    <Select id="country_of_interest" className="mt-2" {...register("country_of_interest")}>
                      <option value="">Not sure yet</option>
                      {countries.map((country) => (
                        <option key={country.slug} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="service_of_interest">Service</Label>
                  <Select id="service_of_interest" className="mt-2" {...register("service_of_interest")}>
                    <option value="">General enquiry</option>
                    {services.map((service) => (
                      <option key={service.slug} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" className="mt-2" placeholder="Tell us about your requirements…" {...register("message")} />
                  <FieldError>{errors.message?.message}</FieldError>
                </div>

                {/* Honeypot — visually hidden, not a display:none trap for screen readers */}
                <div className="absolute left-[-9999px]" aria-hidden>
                  <label htmlFor="company_website">Company website</label>
                  <input id="company_website" tabIndex={-1} autoComplete="off" {...register("company_website")} />
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <input type="checkbox" className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" {...register("consent")} />
                    <span>
                      I agree that {company.legalName} may store and process my details to answer this enquiry, in line with
                      the privacy policy.
                    </span>
                  </label>
                  <FieldError>{errors.consent?.message}</FieldError>
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting}>
                  <Send className="h-4 w-4" aria-hidden />
                  {isSubmitting ? "Sending…" : "Send Message"}
                </Button>

                {!isSupabaseConfigured ? (
                  <p className="text-xs text-muted-foreground">
                    Demo mode: Supabase is not connected, so this form validates and simulates a send without storing data.
                  </p>
                ) : null}
              </form>
            )}
          </div>

          <div>
            <h2 className="text-display-sm">Contact Information</h2>
            <p className="mt-4 text-muted-foreground">Reach out to us through any of these channels.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Card>
                <CardContent className="p-6 pt-6">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-secondary text-primary">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base">Our Office</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {company.address.street}
                    <br />
                    {company.address.city}, {company.address.country}, {company.address.postcode}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 pt-6">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-secondary text-primary">
                    <Phone className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base">Phone</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {company.phones.map((phone) => (
                      <li key={phone}>
                        <a href={"tel:" + phone.replace(/[\s-]/g, "")} className="hover:text-foreground">
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 pt-6">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-secondary text-primary">
                    <Mail className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base">Email</h3>
                  <a href={"mailto:" + company.email} className="mt-2 block text-sm text-muted-foreground hover:text-foreground">
                    {company.email}
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 pt-6">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-secondary text-primary">
                    <Clock className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base">Working Hours</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {company.hours.map((slot) => (
                      <li key={slot.days}>
                        {slot.days}: {slot.time}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 rounded-xl bg-brand-gradient p-6 text-brand-foreground">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-white/10">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold">Need Immediate Help?</p>
                    <p className="text-sm text-brand-foreground/75">Our WhatsApp line is answered 7 days a week.</p>
                  </div>
                </div>
                <Button asChild variant="accent">
                  <a
                    href={"https://wa.me/" + company.whatsapp.replace(/[^0-9]/g, "")}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Start WhatsApp Chat
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
