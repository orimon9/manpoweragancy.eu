/**
 * Hand-maintained mirror of the SQL in `supabase/migrations`.
 * Regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
 */

export type AppRole = "admin" | "staff" | "employer" | "candidate";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "documents_required"
  | "interview_scheduled"
  | "approved"
  | "visa_processing"
  | "deployed"
  | "rejected"
  | "withdrawn";

export type JobStatus = "draft" | "open" | "paused" | "closed" | "filled";

export type DocumentType =
  | "passport"
  | "cv"
  | "photo"
  | "diploma"
  | "experience_letter"
  | "police_clearance"
  | "medical"
  | "contract"
  | "visa"
  | "other";

export type DocStatus = "pending" | "verified" | "rejected" | "expired";

export type InquiryStatus = "new" | "contacted" | "qualified" | "converted" | "closed";

export type EmploymentType = "full_time" | "part_time" | "contract" | "seasonal" | "internship";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = { id: string; created_at: string; updated_at: string };

export type ProfileRow = Timestamps & {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  gender: string | null;
  current_country: string | null;
  city: string | null;
  address: string | null;
  passport_number: string | null;
  passport_expiry: string | null;
  avatar_url: string | null;
  headline: string | null;
  years_experience: number | null;
  skills: string[] | null;
  languages: Json | null;
  preferred_countries: string[] | null;
  profile_completion: number;
  is_active: boolean;
}

export type UserRoleRow = {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export type CountryRow = Timestamps & {
  name: string;
  slug: string;
  iso2: string | null;
  flag_emoji: string | null;
  region: string | null;
  is_eu: boolean;
  hero_image_url: string | null;
  summary: string | null;
  requirements: Json | null;
  processing_time: string | null;
  avg_salary_range: string | null;
  is_active: boolean;
  sort_order: number;
}

export type VisaTypeRow = Timestamps & {
  country_id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  requirements: Json | null;
  documents_required: string[] | null;
  processing_time: string | null;
  govt_fee: number | null;
  service_fee: number | null;
  is_active: boolean;
}

export type ServiceRow = Timestamps & {
  title: string;
  slug: string;
  icon: string | null;
  short_description: string | null;
  content: string | null;
  price_from: number | null;
  currency: string;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
}

export type CompanyRow = Timestamps & {
  owner_id: string | null;
  name: string;
  slug: string;
  reg_number: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  logo_url: string | null;
  industry: string | null;
  description: string | null;
  is_verified: boolean;
}

export type JobCategoryRow = Timestamps & {
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
}

export type JobRow = Timestamps & {
  company_id: string | null;
  category_id: string | null;
  country_id: string | null;
  title: string;
  slug: string;
  employment_type: EmploymentType;
  description: string | null;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  salary_period: string | null;
  vacancies: number;
  experience_required: number | null;
  education_required: string | null;
  age_min: number | null;
  age_max: number | null;
  accommodation_provided: boolean;
  food_provided: boolean;
  ticket_provided: boolean;
  contract_duration: string | null;
  deadline: string | null;
  status: JobStatus;
  is_featured: boolean;
  views: number;
  posted_by: string | null;
}

export type ApplicationRow = Timestamps & {
  applicant_id: string;
  job_id: string | null;
  service_id: string | null;
  visa_type_id: string | null;
  reference_code: string;
  status: ApplicationStatus;
  assigned_to: string | null;
  notes: string | null;
  internal_notes: string | null;
  submitted_at: string | null;
  status_changed_at: string | null;
}

export type ApplicationEventRow = {
  id: string;
  application_id: string;
  from_status: ApplicationStatus | null;
  to_status: ApplicationStatus;
  note: string | null;
  changed_by: string | null;
  created_at: string;
}

export type DocumentRow = Timestamps & {
  owner_id: string;
  application_id: string | null;
  doc_type: DocumentType;
  file_path: string;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  status: DocStatus;
  reviewed_by: string | null;
  review_note: string | null;
  expires_at: string | null;
}

export type AppointmentRow = Timestamps & {
  applicant_id: string;
  staff_id: string | null;
  application_id: string | null;
  title: string;
  scheduled_at: string;
  duration_min: number;
  mode: string | null;
  location: string | null;
  meeting_url: string | null;
  status: string;
  notes: string | null;
}

export type InquiryRow = Timestamps & {
  full_name: string;
  email: string;
  phone: string | null;
  country_of_interest: string | null;
  service_of_interest: string | null;
  message: string;
  source: string | null;
  status: InquiryStatus;
  assigned_to: string | null;
  utm: Json | null;
}

export type BlogPostRow = Timestamps & {
  author_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  views: number;
  seo_title: string | null;
  seo_description: string | null;
}

export type TestimonialRow = Timestamps & {
  name: string;
  country: string | null;
  role: string | null;
  photo_url: string | null;
  rating: number;
  quote: string;
  is_published: boolean;
  sort_order: number;
}

export type FaqRow = Timestamps & {
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_published: boolean;
}

export type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  type: string | null;
  created_at: string;
}

export type SiteSettingRow = Timestamps & {
  key: string;
  value: Json;
}

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<ProfileRow>;
      user_roles: Table<UserRoleRow>;
      countries: Table<CountryRow>;
      visa_types: Table<VisaTypeRow>;
      services: Table<ServiceRow>;
      companies: Table<CompanyRow>;
      job_categories: Table<JobCategoryRow>;
      jobs: Table<JobRow>;
      applications: Table<ApplicationRow>;
      application_events: Table<ApplicationEventRow>;
      documents: Table<DocumentRow>;
      appointments: Table<AppointmentRow>;
      inquiries: Table<InquiryRow>;
      blog_posts: Table<BlogPostRow>;
      testimonials: Table<TestimonialRow>;
      faqs: Table<FaqRow>;
      notifications: Table<NotificationRow>;
      site_settings: Table<SiteSettingRow>;
    };
    Views: {
      applications_public: { Row: Omit<ApplicationRow, "internal_notes">; Relationships: [] };
    };
    Functions: {
      has_role: { Args: { _user_id: string; _role: AppRole }; Returns: boolean };
      is_staff: { Args: { _user_id: string }; Returns: boolean };
    };
    Enums: {
      app_role: AppRole;
      application_status: ApplicationStatus;
      job_status: JobStatus;
      document_type: DocumentType;
      doc_status: DocStatus;
      inquiry_status: InquiryStatus;
      employment_type: EmploymentType;
    };
    CompositeTypes: Record<string, never>;
  };
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  documents_required: "Documents required",
  interview_scheduled: "Interview scheduled",
  approved: "Approved",
  visa_processing: "Visa processing",
  deployed: "Deployed",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: "Passport",
  cv: "CV / résumé",
  photo: "Passport photo",
  diploma: "Diploma / degree",
  experience_letter: "Experience letter",
  police_clearance: "Police clearance",
  medical: "Medical certificate",
  contract: "Employment contract",
  visa: "Visa",
  other: "Other",
};
