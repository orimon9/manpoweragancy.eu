import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Clock, Headphones, Shield } from "lucide-react";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select, Textarea, FieldError } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countries, jobs, services } from "@/content/site";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const stepOne = z.object({
  first_name: z.string().min(2, "Required"),
  last_name: z.string().min(2, "Required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a reachable phone number"),
  nationality: z.string().min(2, "Required"),
});

const stepTwo = z.object({
  service_slug: z.string().min(1, "Choose a service"),
  country_slug: z.string().min(1, "Choose a destination"),
  job_slug: z.string().optional().or(z.literal("")),
  years_experience: z.coerce.number().min(0).max(60),
  highest_education: z.string().min(2, "Required"),
});

const stepThree = z.object({
  notes: z.string().max(2000).optional().or(z.literal("")),
  data_consent: z.literal(true, {
    errorMap: () => ({ message: "We cannot open a file without your explicit consent" }),
  }),
});

const schema = stepOne.merge(stepTwo).merge(stepThree);
type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: (keyof FormValues)[][] = [
  ["first_name", "last_name", "email", "phone", "nationality"],
  ["service_slug", "country_slug", "job_slug", "years_experience", "highest_education"],
  ["notes", "data_consent"],
];

const trustPoints = [
  { icon: Shield, title: "Secure Process", description: "Your data is protected with enterprise-grade security" },
  { icon: Clock, title: "Fast Processing", description: "Average processing time 40% faster than standard" },
  { icon: Headphones, title: "24/7 Support", description: "Our team is available round the clock" },
];

export default function Apply() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [reference, setReference] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      service_slug: params.get("service") ?? "",
      country_slug: params.get("country") ?? "",
      job_slug: params.get("job") ?? "",
      email: user?.email ?? "",
      years_experience: 0,
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, 2));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (isSupabaseConfigured && supabase && user) {
        const service = services.find((s) => s.slug === values.service_slug);
        const { data, error } = await supabase
          .from("applications")
          .insert({
            applicant_id: user.id,
            status: "submitted",
            submitted_at: new Date().toISOString(),
            notes:
              "Service: " +
              (service?.title ?? values.service_slug) +
              "\nDestination: " +
              values.country_slug +
              "\nExperience: " +
              values.years_experience +
              " years\nEducation: " +
              values.highest_education +
              (values.notes ? "\n\n" + values.notes : ""),
          })
          .select("reference_code")
          .single();
        if (error) throw error;
        setReference(data.reference_code);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));
        const seq = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
        setReference("MGA-" + new Date().getFullYear() + "-" + seq);
      }

      toast.success("Application submitted", { description: "Keep your reference code safe." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error("Could not submit your application", { description: message });
    }
  };

  if (reference) {
    return (
      <>
        <Seo title="Application submitted" description="Your application reference code." path="/apply" noindex />
        <PageHero eyebrow="Received" title="Your application is with our team" />
        <section className="section">
          <div className="container max-w-2xl">
            <Card>
              <CardContent className="p-8 pt-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
                <h2 className="mt-5 text-xl">Reference code</h2>
                <p className="mt-3 font-display text-3xl font-bold tracking-wide text-primary">{reference}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Save this code. You can use it on the tracking page, and it identifies your file in every email we send.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild variant="accent">
                    <Link to="/track">Track this application</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/">Back to home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Apply for Your Visa"
        description="Complete the form to begin your immigration journey with our expert team."
        path="/apply"
      />

      <PageHero
        eyebrow="Start Your Journey"
        title="Apply for Your Visa"
        description="Complete the form below to begin your immigration journey with our expert team."
      />

      <section className="border-b border-border bg-secondary/50 py-10">
        <div className="container grid gap-6 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div key={point.title} className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-card text-primary shadow-e1">
                <point.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-display font-bold">{point.title}</p>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl">
          <ol className="flex items-center justify-center gap-3" aria-label="Application progress">
            {[0, 1, 2].map((index) => (
              <li key={index} className="flex items-center gap-3">
                <span
                  aria-current={index === step ? "step" : undefined}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full text-sm font-semibold",
                    index <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}
                >
                  {index + 1}
                </span>
                {index < 2 ? <span className="h-px w-14 bg-border" aria-hidden /> : null}
              </li>
            ))}
          </ol>

          <Card className="mt-10">
            <CardContent className="p-8 pt-8">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {step === 0 ? (
                  <fieldset>
                    <legend className="font-display font-bold text-display-sm">Personal Information</legend>
                    <p className="mt-2 text-muted-foreground">Please provide your basic details</p>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input id="first_name" className="mt-2" placeholder="John" autoComplete="given-name" {...register("first_name")} />
                        <FieldError>{errors.first_name?.message}</FieldError>
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input id="last_name" className="mt-2" placeholder="Doe" autoComplete="family-name" {...register("last_name")} />
                        <FieldError>{errors.last_name?.message}</FieldError>
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" className="mt-2" placeholder="john@example.com" autoComplete="email" {...register("email")} />
                        <FieldError>{errors.email?.message}</FieldError>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" className="mt-2" placeholder="+40 123 456 789" autoComplete="tel" {...register("phone")} />
                        <FieldError>{errors.phone?.message}</FieldError>
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="nationality">Nationality *</Label>
                        <Input id="nationality" className="mt-2" placeholder="e.g., Indian" {...register("nationality")} />
                        <FieldError>{errors.nationality?.message}</FieldError>
                      </div>
                    </div>
                  </fieldset>
                ) : null}

                {step === 1 ? (
                  <fieldset>
                    <legend className="font-display font-bold text-display-sm">Your Route</legend>
                    <p className="mt-2 text-muted-foreground">Tell us where you want to go and what you have done so far</p>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="service_slug">Service *</Label>
                        <Select id="service_slug" className="mt-2" {...register("service_slug")}>
                          <option value="">Select a service</option>
                          {services.map((service) => (
                            <option key={service.slug} value={service.slug}>
                              {service.title}
                            </option>
                          ))}
                        </Select>
                        <FieldError>{errors.service_slug?.message}</FieldError>
                      </div>
                      <div>
                        <Label htmlFor="country_slug">Destination *</Label>
                        <Select id="country_slug" className="mt-2" {...register("country_slug")}>
                          <option value="">Select a country</option>
                          {countries.map((country) => (
                            <option key={country.slug} value={country.slug}>
                              {country.name}
                            </option>
                          ))}
                        </Select>
                        <FieldError>{errors.country_slug?.message}</FieldError>
                      </div>
                      <div>
                        <Label htmlFor="job_slug">Specific vacancy</Label>
                        <Select id="job_slug" className="mt-2" {...register("job_slug")}>
                          <option value="">Not applying to a specific role</option>
                          {jobs.map((job) => (
                            <option key={job.slug} value={job.slug}>
                              {job.title} — {job.company}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="years_experience">Years of experience *</Label>
                        <Input id="years_experience" type="number" min={0} max={60} className="mt-2" {...register("years_experience")} />
                        <FieldError>{errors.years_experience?.message}</FieldError>
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="highest_education">Highest education *</Label>
                        <Input id="highest_education" className="mt-2" placeholder="e.g., BSc Computer Science" {...register("highest_education")} />
                        <FieldError>{errors.highest_education?.message}</FieldError>
                      </div>
                    </div>
                  </fieldset>
                ) : null}

                {step === 2 ? (
                  <fieldset>
                    <legend className="font-display font-bold text-display-sm">Anything Else?</legend>
                    <p className="mt-2 text-muted-foreground">Add context that will help us assess your file</p>

                    <div className="mt-8">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        className="mt-2"
                        placeholder="Previous visa refusals, family already in the EU, language certificates…"
                        {...register("notes")}
                      />
                    </div>

                    <div className="mt-6 rounded-md border border-border bg-secondary/50 p-5">
                      <label className="flex items-start gap-3 text-sm">
                        <input type="checkbox" className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" {...register("data_consent")} />
                        <span className="text-muted-foreground">
                          I consent to Manpower Global Agency SRL processing my personal data, including passport and
                          education documents, for the purpose of preparing and submitting this application. I understand I
                          can withdraw consent and request deletion at any time.
                        </span>
                      </label>
                      <FieldError>{errors.data_consent?.message}</FieldError>
                    </div>

                    {!user && isSupabaseConfigured ? (
                      <p className="mt-5 text-sm text-muted-foreground">
                        You are not signed in.{" "}
                        <Link to="/auth?redirectTo=%2Fapply" className="text-primary underline">
                          Create an account
                        </Link>{" "}
                        to track this application in your dashboard.
                      </p>
                    ) : null}
                  </fieldset>
                ) : null}

                <div className="mt-8 flex items-center justify-between gap-4">
                  <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
                    Back
                  </Button>

                  {step < 2 ? (
                    <Button type="button" onClick={next} size="lg">
                      Continue <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  ) : (
                    <Button type="submit" size="lg" variant="accent" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting…" : "Submit application"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
