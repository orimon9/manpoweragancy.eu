import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FieldError } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, Skeleton } from "@/components/ui/misc";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile, useUpdateProfile } from "@/lib/queries";
import { requireSupabase } from "@/lib/supabase";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  phone: z.string().max(40).optional().or(z.literal("")),
  whatsapp: z.string().max(40).optional().or(z.literal("")),
  nationality: z.string().max(80).optional().or(z.literal("")),
  current_country: z.string().max(80).optional().or(z.literal("")),
  city: z.string().max(80).optional().or(z.literal("")),
  headline: z.string().max(160).optional().or(z.literal("")),
  years_experience: z.coerce.number().min(0).max(60).optional(),
  skills: z.string().max(500).optional().or(z.literal("")),
  passport_number: z.string().max(40).optional().or(z.literal("")),
  passport_expiry: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const TRACKED_FIELDS: (keyof FormValues)[] = [
  "full_name",
  "phone",
  "nationality",
  "current_country",
  "city",
  "headline",
  "years_experience",
  "skills",
  "passport_number",
  "passport_expiry",
];

export default function DashboardProfile() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);
  const updateProfile = useUpdateProfile(user?.id);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!profile) return;
    reset({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      whatsapp: profile.whatsapp ?? "",
      nationality: profile.nationality ?? "",
      current_country: profile.current_country ?? "",
      city: profile.city ?? "",
      headline: profile.headline ?? "",
      years_experience: profile.years_experience ?? 0,
      skills: (profile.skills ?? []).join(", "),
      passport_number: profile.passport_number ?? "",
      passport_expiry: profile.passport_expiry ?? "",
    });
  }, [profile, reset]);

  const onSubmit = async (values: FormValues) => {
    const filled = TRACKED_FIELDS.filter((field) => {
      const value = values[field];
      return value !== undefined && value !== null && String(value).trim() !== "" && String(value) !== "0";
    }).length;
    const completion = Math.round((filled / TRACKED_FIELDS.length) * 100);

    try {
      await updateProfile.mutateAsync({
        full_name: values.full_name,
        phone: values.phone || null,
        whatsapp: values.whatsapp || null,
        nationality: values.nationality || null,
        current_country: values.current_country || null,
        city: values.city || null,
        headline: values.headline || null,
        years_experience: values.years_experience ?? null,
        skills: values.skills ? values.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        passport_number: values.passport_number || null,
        passport_expiry: values.passport_expiry || null,
        profile_completion: completion,
      });
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save profile");
    }
  };

  const onAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar must be smaller than 2 MB");
      return;
    }

    setUploading(true);
    try {
      const supabase = requireSupabase();
      const path = user.id + "/avatar-" + Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await updateProfile.mutateAsync({ avatar_url: data.publicUrl });
      toast.success("Photo updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display-sm">Your profile</h1>
        <p className="mt-2 text-muted-foreground">
          The more complete your profile, the faster we can match you and prepare your file.
        </p>
        <Progress value={profile?.profile_completion ?? 0} className="mt-4 max-w-sm" />
      </header>

      <Card>
        <CardContent className="p-6 pt-6">
          <div className="flex flex-wrap items-center gap-5">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover" width={80} height={80} />
            ) : (
              <span className="grid h-20 w-20 place-items-center rounded-full bg-secondary font-display text-2xl font-bold text-primary">
                {(profile?.full_name ?? "?").slice(0, 1)}
              </span>
            )}
            <div>
              <Label htmlFor="avatar">Profile photo</Label>
              <input
                id="avatar"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={onAvatarChange}
                disabled={uploading}
                className="mt-2 block text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium"
              />
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WebP, up to 2 MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2" noValidate>
            <div className="sm:col-span-2">
              <Label htmlFor="full_name">Full name *</Label>
              <Input id="full_name" className="mt-2" {...register("full_name")} />
              <FieldError>{errors.full_name?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" className="mt-2" {...register("phone")} />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" className="mt-2" {...register("whatsapp")} />
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" className="mt-2" {...register("nationality")} />
            </div>
            <div>
              <Label htmlFor="current_country">Current country</Label>
              <Input id="current_country" className="mt-2" {...register("current_country")} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" className="mt-2" {...register("city")} />
            </div>
            <div>
              <Label htmlFor="years_experience">Years of experience</Label>
              <Input id="years_experience" type="number" min={0} max={60} className="mt-2" {...register("years_experience")} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" className="mt-2" placeholder="Registered nurse, 6 years ICU experience" {...register("headline")} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Textarea id="skills" className="mt-2" placeholder="Patient care, IV therapy, English B2" {...register("skills")} />
            </div>

            <div className="sm:col-span-2">
              <p className="rounded-md border border-warning/40 bg-warning/10 p-4 text-sm text-muted-foreground">
                Passport details are optional here and are only needed once your route is confirmed. They are stored
                encrypted and are visible only to you and your assigned consultant.
              </p>
            </div>
            <div>
              <Label htmlFor="passport_number">Passport number</Label>
              <Input id="passport_number" className="mt-2" autoComplete="off" {...register("passport_number")} />
            </div>
            <div>
              <Label htmlFor="passport_expiry">Passport expiry</Label>
              <Input id="passport_expiry" type="date" className="mt-2" {...register("passport_expiry")} />
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting || updateProfile.isPending}>
                {isSubmitting || updateProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
