-- ============================================================================
-- Manpower Global Agency SRL — 0002 row level security
--
-- STEP 1 role helpers, STEP 2 table policies, STEP 3 storage policies.
-- The permission matrix (STEP 4) is in supabase/RLS-MATRIX.md.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- STEP 1 — role helpers.
-- SECURITY DEFINER + stable, so a policy can ask "does this user hold role X?"
-- WITHOUT selecting from user_roles inside the policy (which recurses).
-- ---------------------------------------------------------------------------
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(_user_id, 'admin') or public.has_role(_user_id, 'staff');
$$;

revoke execute on function public.has_role(uuid, public.app_role) from public;
revoke execute on function public.is_staff(uuid) from public;
grant execute on function public.has_role(uuid, public.app_role) to anon, authenticated;
grant execute on function public.is_staff(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- STEP 2 — table policies
-- ---------------------------------------------------------------------------

-- ---- Public read / staff write --------------------------------------------
create policy "countries readable when active"
  on public.countries for select to anon, authenticated
  using (is_active = true or public.is_staff(auth.uid()));
create policy "countries writable by staff"
  on public.countries for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "visa types readable when active"
  on public.visa_types for select to anon, authenticated
  using (is_active = true or public.is_staff(auth.uid()));
create policy "visa types writable by staff"
  on public.visa_types for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "services readable when active"
  on public.services for select to anon, authenticated
  using (is_active = true or public.is_staff(auth.uid()));
create policy "services writable by staff"
  on public.services for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "job categories readable by everyone"
  on public.job_categories for select to anon, authenticated using (true);
create policy "job categories writable by staff"
  on public.job_categories for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "testimonials readable when published"
  on public.testimonials for select to anon, authenticated
  using (is_published = true or public.is_staff(auth.uid()));
create policy "testimonials writable by staff"
  on public.testimonials for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "faqs readable when published"
  on public.faqs for select to anon, authenticated
  using (is_published = true or public.is_staff(auth.uid()));
create policy "faqs writable by staff"
  on public.faqs for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "posts readable when published"
  on public.blog_posts for select to anon, authenticated
  using (is_published = true or public.is_staff(auth.uid()));
create policy "posts writable by staff"
  on public.blog_posts for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "settings readable by everyone"
  on public.site_settings for select to anon, authenticated using (true);
create policy "settings writable by staff"
  on public.site_settings for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ---- Companies -------------------------------------------------------------
create policy "verified companies are public"
  on public.companies for select to anon, authenticated
  using (is_verified = true or owner_id = auth.uid() or public.is_staff(auth.uid()));
create policy "employers create their own company"
  on public.companies for insert to authenticated
  with check (owner_id = auth.uid() or public.is_staff(auth.uid()));
create policy "employers update their own company"
  on public.companies for update to authenticated
  using (owner_id = auth.uid() or public.is_staff(auth.uid()))
  with check (owner_id = auth.uid() or public.is_staff(auth.uid()));
create policy "only staff delete companies"
  on public.companies for delete to authenticated
  using (public.is_staff(auth.uid()));

-- ---- Profiles --------------------------------------------------------------
create policy "read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = user_id);
create policy "staff read all profiles"
  on public.profiles for select to authenticated
  using (public.is_staff(auth.uid()));
create policy "insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = user_id);
create policy "update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "staff update profiles"
  on public.profiles for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
-- No general DELETE policy: only admins may delete a profile.
create policy "admins delete profiles"
  on public.profiles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ---- User roles ------------------------------------------------------------
-- A user may READ their own roles but must NEVER be able to grant themselves one.
create policy "read own roles"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid());
create policy "staff read all roles"
  on public.user_roles for select to authenticated
  using (public.is_staff(auth.uid()));
create policy "only admins grant roles"
  on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "only admins change roles"
  on public.user_roles for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "only admins revoke roles"
  on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ---- Jobs ------------------------------------------------------------------
create policy "open jobs are public"
  on public.jobs for select to anon, authenticated
  using (status = 'open');
create policy "owners and staff see all jobs"
  on public.jobs for select to authenticated
  using (
    posted_by = auth.uid()
    or public.is_staff(auth.uid())
    or exists (select 1 from public.companies c where c.id = jobs.company_id and c.owner_id = auth.uid())
  );
create policy "employers and staff create jobs"
  on public.jobs for insert to authenticated
  with check (
    public.is_staff(auth.uid())
    or exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid())
  );
create policy "employers and staff update jobs"
  on public.jobs for update to authenticated
  using (
    public.is_staff(auth.uid())
    or exists (select 1 from public.companies c where c.id = jobs.company_id and c.owner_id = auth.uid())
  )
  with check (
    public.is_staff(auth.uid())
    or exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid())
  );
create policy "only staff delete jobs"
  on public.jobs for delete to authenticated
  using (public.is_staff(auth.uid()));

-- ---- Applications ----------------------------------------------------------
create policy "applicants, staff and hiring employers read applications"
  on public.applications for select to authenticated
  using (
    applicant_id = auth.uid()
    or public.is_staff(auth.uid())
    or exists (
      select 1
      from public.jobs j
      join public.companies c on c.id = j.company_id
      where j.id = applications.job_id and c.owner_id = auth.uid()
    )
  );

create policy "applicants create their own applications"
  on public.applications for insert to authenticated
  with check (applicant_id = auth.uid());

-- An applicant may only edit while the file is still a draft.
create policy "applicants edit drafts only"
  on public.applications for update to authenticated
  using (applicant_id = auth.uid() and status = 'draft')
  with check (applicant_id = auth.uid() and status in ('draft', 'submitted', 'withdrawn'));

create policy "staff update any application"
  on public.applications for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "only staff delete applications"
  on public.applications for delete to authenticated
  using (public.is_staff(auth.uid()));

-- internal_notes must never reach the applicant. RLS is row-level, not
-- column-level, so revoke the column privilege as well as exposing a view.
revoke select (internal_notes) on public.applications from authenticated, anon;

create or replace view public.applications_public
with (security_invoker = on) as
  select
    id, applicant_id, job_id, service_id, visa_type_id, reference_code, status,
    assigned_to, notes, submitted_at, status_changed_at, created_at, updated_at
  from public.applications;

grant select on public.applications_public to authenticated;

-- ---- Application events (immutable audit trail) ----------------------------
create policy "owners and staff read the timeline"
  on public.application_events for select to authenticated
  using (
    public.is_staff(auth.uid())
    or exists (
      select 1 from public.applications a
      where a.id = application_events.application_id and a.applicant_id = auth.uid()
    )
  );
create policy "only staff insert timeline entries"
  on public.application_events for insert to authenticated
  with check (public.is_staff(auth.uid()));
-- Deliberately NO update or delete policy for anyone: the trail is immutable.

-- ---- Documents -------------------------------------------------------------
create policy "owners read their documents"
  on public.documents for select to authenticated
  using (owner_id = auth.uid());
create policy "staff read all documents"
  on public.documents for select to authenticated
  using (public.is_staff(auth.uid()));
create policy "owners upload their documents"
  on public.documents for insert to authenticated
  with check (owner_id = auth.uid());
create policy "staff review documents"
  on public.documents for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- Deletion is blocked once the linked application has moved past review.
create policy "owners delete documents before review"
  on public.documents for delete to authenticated
  using (
    owner_id = auth.uid()
    and (
      application_id is null
      or exists (
        select 1 from public.applications a
        where a.id = documents.application_id
          and a.status in ('draft', 'submitted', 'under_review', 'documents_required')
      )
    )
  );
create policy "staff delete documents"
  on public.documents for delete to authenticated
  using (public.is_staff(auth.uid()));

-- ---- Appointments ----------------------------------------------------------
create policy "participants read appointments"
  on public.appointments for select to authenticated
  using (applicant_id = auth.uid() or staff_id = auth.uid() or public.is_staff(auth.uid()));
create policy "staff create appointments"
  on public.appointments for insert to authenticated
  with check (public.is_staff(auth.uid()));
create policy "staff update appointments"
  on public.appointments for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff delete appointments"
  on public.appointments for delete to authenticated
  using (public.is_staff(auth.uid()));

-- ---- Notifications ---------------------------------------------------------
create policy "read own notifications"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());
create policy "update own notifications"
  on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "staff create notifications"
  on public.notifications for insert to authenticated
  with check (public.is_staff(auth.uid()));
create policy "owners delete own notifications"
  on public.notifications for delete to authenticated
  using (user_id = auth.uid());

-- ---- Inquiries -------------------------------------------------------------
-- Anonymous visitors may CREATE (public contact form) but never read back.
create policy "anyone can submit an inquiry"
  on public.inquiries for insert to anon, authenticated
  with check (true);
create policy "only staff read inquiries"
  on public.inquiries for select to authenticated
  using (public.is_staff(auth.uid()));
create policy "only staff update inquiries"
  on public.inquiries for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "only staff delete inquiries"
  on public.inquiries for delete to authenticated
  using (public.is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- STEP 3 — storage policies
-- Path convention for private documents: {user_id}/{filename}
-- ---------------------------------------------------------------------------
create policy "owners read their own documents"
  on storage.objects for select to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "staff read every document"
  on storage.objects for select to authenticated
  using (bucket_id = 'documents' and public.is_staff(auth.uid()));

create policy "owners upload into their own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owners delete their own documents"
  on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars are publicly readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'avatars');

create policy "users manage their own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users replace their own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "media is publicly readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

create policy "only staff upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff(auth.uid()));

create policy "only staff change media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()))
  with check (bucket_id = 'media' and public.is_staff(auth.uid()));

create policy "only staff delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));
