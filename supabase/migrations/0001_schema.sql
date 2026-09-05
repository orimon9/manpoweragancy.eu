-- ============================================================================
-- Manpower Global Agency SRL — 0001 schema
-- Enums, tables, functions, triggers, indexes, storage buckets.
-- RLS is ENABLED here; the policies live in 0002_rls.sql.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'staff', 'employer', 'candidate');

create type public.application_status as enum (
  'draft', 'submitted', 'under_review', 'documents_required', 'interview_scheduled',
  'approved', 'visa_processing', 'deployed', 'rejected', 'withdrawn'
);

create type public.job_status as enum ('draft', 'open', 'paused', 'closed', 'filled');

create type public.document_type as enum (
  'passport', 'cv', 'photo', 'diploma', 'experience_letter', 'police_clearance',
  'medical', 'contract', 'visa', 'other'
);

create type public.doc_status as enum ('pending', 'verified', 'rejected', 'expired');

create type public.inquiry_status as enum ('new', 'contacted', 'qualified', 'converted', 'closed');

create type public.employment_type as enum ('full_time', 'part_time', 'contract', 'seasonal', 'internship');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users on delete cascade,
  full_name text,
  email text,
  phone text,
  whatsapp text,
  date_of_birth date,
  nationality text,
  gender text,
  current_country text,
  city text,
  address text,
  passport_number text,
  passport_expiry date,
  avatar_url text,
  headline text,
  years_experience int check (years_experience between 0 and 70),
  skills text[] default '{}',
  languages jsonb default '[]'::jsonb,
  preferred_countries text[] default '{}',
  profile_completion int not null default 0 check (profile_completion between 0 and 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users on delete set null,
  name text not null,
  slug text not null unique,
  reg_number text,
  country text,
  city text,
  website text,
  logo_url text,
  industry text,
  description text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  iso2 char(2),
  flag_emoji text,
  region text,
  is_eu boolean not null default false,
  hero_image_url text,
  summary text,
  requirements jsonb default '[]'::jsonb,
  processing_time text,
  avg_salary_range text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.visa_types (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries on delete cascade,
  name text not null,
  slug text not null,
  category text,
  description text,
  requirements jsonb default '[]'::jsonb,
  documents_required text[] default '{}',
  processing_time text,
  govt_fee numeric(10, 2),
  service_fee numeric(10, 2),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_id, slug)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  icon text,
  short_description text,
  content text,
  price_from numeric(10, 2),
  currency text not null default 'EUR',
  is_featured boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies on delete set null,
  category_id uuid references public.job_categories on delete set null,
  country_id uuid references public.countries on delete set null,
  title text not null,
  slug text not null unique,
  employment_type public.employment_type not null default 'full_time',
  description text,
  responsibilities text,
  requirements text,
  benefits text,
  salary_min numeric(12, 2),
  salary_max numeric(12, 2),
  currency text not null default 'EUR',
  salary_period text default 'year',
  vacancies int not null default 1 check (vacancies > 0),
  experience_required int,
  education_required text,
  age_min int,
  age_max int,
  accommodation_provided boolean not null default false,
  food_provided boolean not null default false,
  ticket_provided boolean not null default false,
  contract_duration text,
  deadline date,
  status public.job_status not null default 'draft',
  is_featured boolean not null default false,
  views int not null default 0,
  posted_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (salary_max is null or salary_min is null or salary_max >= salary_min)
);

create sequence if not exists public.app_ref_seq start 1;

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users on delete cascade,
  job_id uuid references public.jobs on delete set null,
  service_id uuid references public.services on delete set null,
  visa_type_id uuid references public.visa_types on delete set null,
  reference_code text unique,
  status public.application_status not null default 'draft',
  assigned_to uuid references auth.users on delete set null,
  notes text,
  internal_notes text,
  submitted_at timestamptz,
  status_changed_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications on delete cascade,
  from_status public.application_status,
  to_status public.application_status not null,
  note text,
  changed_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  application_id uuid references public.applications on delete set null,
  doc_type public.document_type not null default 'other',
  file_path text not null,
  file_name text,
  file_size int,
  mime_type text,
  status public.doc_status not null default 'pending',
  reviewed_by uuid references auth.users on delete set null,
  review_note text,
  expires_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users on delete cascade,
  staff_id uuid references auth.users on delete set null,
  application_id uuid references public.applications on delete set null,
  title text not null,
  scheduled_at timestamptz not null,
  duration_min int not null default 30,
  mode text default 'in_person',
  location text,
  meeting_url text,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  country_of_interest text,
  service_of_interest text,
  message text not null,
  source text,
  status public.inquiry_status not null default 'new',
  assigned_to uuid references auth.users on delete set null,
  utm jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  tags text[] default '{}',
  is_published boolean not null default false,
  published_at timestamptz,
  views int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  role text,
  photo_url text,
  rating int not null default 5 check (rating between 1 and 5),
  quote text not null,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  type text,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Functions & triggers
-- ---------------------------------------------------------------------------

-- 1. updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'companies', 'countries', 'visa_types', 'services', 'job_categories',
    'jobs', 'applications', 'documents', 'appointments', 'inquiries', 'blog_posts',
    'testimonials', 'faqs', 'site_settings'
  ]
  loop
    execute format(
      'create trigger set_updated_at_%1$s before update on public.%1$I
       for each row execute function public.set_updated_at()', t
    );
  end loop;
end;
$$;

-- 2. new auth user -> profile + default candidate role
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (user_id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'candidate')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 3. human-readable reference code
create or replace function public.generate_reference_code()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.reference_code is null then
    new.reference_code :=
      'MGA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.app_ref_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger set_reference_code
before insert on public.applications
for each row execute function public.generate_reference_code();

-- 4. immutable status audit trail
create or replace function public.log_application_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.application_events (application_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());

    new.status_changed_at := now();
  end if;
  return new;
end;
$$;

create trigger log_application_status_change
before update on public.applications
for each row execute function public.log_application_status();

-- Seed the timeline with the opening event too.
create or replace function public.log_application_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.application_events (application_id, from_status, to_status, changed_by)
  values (new.id, null, new.status, auth.uid());
  return new;
end;
$$;

create trigger log_application_created
after insert on public.applications
for each row execute function public.log_application_created();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index idx_profiles_user_id on public.profiles (user_id);
create index idx_user_roles_user_id on public.user_roles (user_id);
create index idx_companies_owner on public.companies (owner_id);
create index idx_visa_types_country on public.visa_types (country_id);
create index idx_jobs_company on public.jobs (company_id);
create index idx_jobs_category on public.jobs (category_id);
create index idx_jobs_country on public.jobs (country_id);
create index idx_jobs_posted_by on public.jobs (posted_by);
create index idx_jobs_status_country_category on public.jobs (status, country_id, category_id);
create index idx_jobs_search on public.jobs
  using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
create index idx_applications_applicant_status on public.applications (applicant_id, status);
create index idx_applications_assigned on public.applications (assigned_to);
create index idx_applications_job on public.applications (job_id);
create index idx_application_events_application on public.application_events (application_id);
create index idx_documents_owner_application on public.documents (owner_id, application_id);
create index idx_documents_status on public.documents (status);
create index idx_appointments_applicant on public.appointments (applicant_id);
create index idx_appointments_staff on public.appointments (staff_id);
create index idx_inquiries_status on public.inquiries (status);
create index idx_notifications_user_read on public.notifications (user_id, is_read);
create index idx_blog_posts_published on public.blog_posts (is_published, published_at desc);

-- ---------------------------------------------------------------------------
-- Enable RLS on every table (policies land in 0002_rls.sql).
-- FORCE on the two tables holding personal documents so even the table owner
-- goes through the policies.
-- ---------------------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.user_roles          enable row level security;
alter table public.companies           enable row level security;
alter table public.countries           enable row level security;
alter table public.visa_types          enable row level security;
alter table public.services            enable row level security;
alter table public.job_categories      enable row level security;
alter table public.jobs                enable row level security;
alter table public.applications        enable row level security;
alter table public.application_events  enable row level security;
alter table public.documents           enable row level security;
alter table public.appointments        enable row level security;
alter table public.inquiries           enable row level security;
alter table public.blog_posts          enable row level security;
alter table public.testimonials        enable row level security;
alter table public.faqs                enable row level security;
alter table public.notifications       enable row level security;
alter table public.site_settings       enable row level security;

alter table public.applications force row level security;
alter table public.documents    force row level security;

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('documents', 'documents', false),
  ('avatars',   'avatars',   true),
  ('media',     'media',     true)
on conflict (id) do nothing;
