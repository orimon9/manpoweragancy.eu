-- ============================================================================
-- Manpower Global Agency SRL — 0003 seed data
-- Reference data only. No user rows: those are created by handle_new_user().
-- ============================================================================

insert into public.countries (name, slug, iso2, flag_emoji, region, is_eu, summary, processing_time, avg_salary_range, sort_order) values
  ('Romania',        'romania',     'RO', '🇷🇴', 'Eastern Europe', true,  'Our home market. Fast-growing economy, accessible work-permit regime and a five-year path to permanent residency.', '45–90 days',   '€10,000 – €60,000 / year', 1),
  ('Poland',         'poland',      'PL', '🇵🇱', 'Central Europe', true,  'High demand across manufacturing, logistics and construction.',                                              '60–120 days',  '€12,000 – €45,000 / year', 2),
  ('Croatia',        'croatia',     'HR', '🇭🇷', 'Southern Europe', true, 'Schengen member with strong seasonal and year-round demand in tourism and shipbuilding.',                    '45–90 days',   '€12,000 – €38,000 / year', 3),
  ('Hungary',        'hungary',     'HU', '🇭🇺', 'Central Europe', true,  'Automotive and electronics manufacturing hubs.',                                                             '60–90 days',   '€11,000 – €40,000 / year', 4),
  ('Portugal',       'portugal',    'PT', '🇵🇹', 'Western Europe', true,  'One of Europe''s most welcoming residency regimes.',                                                         '60–120 days',  '€14,000 – €55,000 / year', 5),
  ('Malta',          'malta',       'MT', '🇲🇹', 'Southern Europe', true, 'English-speaking EU member with demand in gaming, finance and healthcare.',                                  '45–90 days',   '€15,000 – €55,000 / year', 6),
  ('Lithuania',      'lithuania',   'LT', '🇱🇹', 'Baltics', true,         'Fast-growing logistics and transport sector with a shortage-occupation fast track.',                          '30–90 days',   '€12,000 – €42,000 / year', 7),
  ('Slovakia',       'slovakia',    'SK', '🇸🇰', 'Central Europe', true,  'Automotive manufacturing centre of Europe.',                                                                 '60–100 days',  '€12,000 – €40,000 / year', 8),
  ('Germany',        'germany',     'DE', '🇩🇪', 'Western Europe', true,  'Europe''s largest labour market, opened further by the Skilled Immigration Act.',                             '60–150 days',  '€30,000 – €85,000 / year', 9),
  ('Netherlands',    'netherlands', 'NL', '🇳🇱', 'Western Europe', true,  'Highly skilled migrant scheme with fast decisions for recognised sponsors.',                                  '30–90 days',   '€35,000 – €90,000 / year', 10),
  ('United Arab Emirates', 'uae',   'AE', '🇦🇪', 'Middle East', false,    'Tax-free income and rapid processing across construction, hospitality and logistics.',                        '15–45 days',   '€9,000 – €70,000 / year',  11),
  ('Canada',         'canada',      'CA', '🇨🇦', 'North America', false,  'Express Entry and provincial nominee programmes offering a direct route to permanent residency.',             '6–12 months',  '€28,000 – €80,000 / year', 12)
on conflict (slug) do nothing;

insert into public.job_categories (name, slug, icon, sort_order) values
  ('IT & Software',        'it-software',      'briefcase',     1),
  ('Healthcare',           'healthcare',       'heart-pulse',   2),
  ('Construction',         'construction',     'hammer',        3),
  ('Logistics',            'logistics',        'package',       4),
  ('Hospitality',          'hospitality',      'utensils',      5),
  ('Manufacturing',        'manufacturing',    'factory',       6),
  ('Finance',              'finance',          'trending-up',   7),
  ('Marketing',            'marketing',        'megaphone',     8)
on conflict (slug) do nothing;

insert into public.services (title, slug, icon, short_description, price_from, is_featured, sort_order) values
  ('Work Permit Visa',      'work-permit-visa',     'briefcase',      'Comprehensive assistance for employment-based immigration to Romania and EU countries.', 950,  true, 1),
  ('Student Visa',          'student-visa',         'graduation-cap', 'Expert guidance for international students seeking education opportunities in Europe.',  750,  true, 2),
  ('Business Visa',         'business-visa',        'building-2',     'Streamlined processing for entrepreneurs and business professionals.',                   1200, true, 3),
  ('Investor Visa',         'investor-visa',        'landmark',       'Golden visa programmes and investment-based residency solutions.',                       2500, true, 4),
  ('Family Reunification',  'family-reunification', 'users',          'Reunite with your loved ones through our family visa services.',                         850,  true, 5),
  ('TRC Extension',         'trc-extension',        'file-text',      'Temporary Residence Card renewal and extension services.',                               350,  true, 6)
on conflict (slug) do nothing;

insert into public.faqs (question, answer, category, sort_order) values
  ('How long does a Romanian work permit take?', 'The employer files for a work permit with the General Inspectorate for Immigration, which typically takes 30–45 days. The long-stay visa is then decided within a further 20–30 days, so plan for 60–90 days end to end.', 'Work visa', 1),
  ('Do you guarantee that my visa will be approved?', 'No reputable agency can guarantee a visa — the decision belongs to the consulate or immigration authority. What we guarantee is a complete, correctly legalised file submitted on time.', 'General', 2),
  ('What documents do I need to start?', 'Your passport bio page, an up-to-date CV, your highest education certificate and any experience letters. Police clearance and medical certificates come later because they have limited validity.', 'Documents', 3),
  ('How are your fees structured?', 'Fees split into a service fee paid to us and government or embassy fees paid to the authority. You get a written breakdown before any payment, and government fees are shown at cost.', 'Fees', 4),
  ('Can my family join me?', 'Yes. Once you hold a valid residence permit your spouse and dependent children can apply for family reunification, usually after 12 months and subject to accommodation and income tests.', 'Family', 5),
  ('Do you help with accommodation and travel?', 'Yes. Our services department arranges air ticketing, airport pick-up and initial accommodation, and many employer partners include accommodation.', 'Support', 6),
  ('Is my personal data safe?', 'We are a Romanian company processing your data under the GDPR. Documents live in an encrypted, access-controlled store visible only to you and your assigned consultant.', 'Privacy', 7),
  ('What is a TRC and when must I renew it?', 'A Temporary Residence Card is your in-country residence document, usually issued for 12 months and renewed at least 30 days before expiry. We track renewal deadlines for every client.', 'Residency', 8),
  ('Can I switch employers after I arrive?', 'In most EU states yes, but the new employer must file a transfer or fresh permit before you start work. Leaving without arranging this can invalidate your residence permit.', 'Work visa', 9),
  ('How do I track my application?', 'Every application gets a reference code like MGA-2026-000123. Sign in to your dashboard for the live status timeline, outstanding documents and appointments.', 'Tracking', 10)
on conflict do nothing;

insert into public.testimonials (name, country, role, rating, quote, is_published, sort_order) values
  ('Maria Popescu',  'India → Romania',      'IT Professional',   5, 'Manpower made my work visa process incredibly smooth. Their team handled everything professionally, and I received my visa faster than expected. Highly recommend!', true, 1),
  ('Ahmed Hassan',   'Egypt → Germany',      'University Student',5, 'The student visa guidance was exceptional. They helped me secure admission and visa for my dream university. The 24/7 support was invaluable during the process.', true, 2),
  ('Li Wei Chen',    'China → Romania',      'Business Owner',    5, 'As an investor, I needed reliable partners for my business visa. Manpower exceeded all expectations with their professionalism and expertise in EU immigration.', true, 3),
  ('Sarah Thompson', 'Philippines → Italy',  'Healthcare Worker', 5, 'The family reunification process was handled with such care and attention. My family is now together in Europe thanks to their dedicated team.', true, 4),
  ('Rajesh Kumar',   'India → Poland',       'Warehouse Team Lead',5,'Straight answers about cost and timeline from day one, and no hidden fees. I was in Wrocław within four months of my first call.', true, 5),
  ('Fatima Zahra',   'Morocco → Netherlands','Financial Analyst', 5, 'They knew exactly which employers were recognised sponsors, which saved me months. The 30% ruling paperwork was handled for me too.', true, 6)
on conflict do nothing;

insert into public.site_settings (key, value) values
  ('contact',   '{"email":"info.fiaeurope@gmail.com","phones":["+358-413114204","+40 734 304 768"],"whatsapp":"+40734304768"}'::jsonb),
  ('office',    '{"street":"Bd. General Gheorghe Magheru, Etaj-05, Sector-01","city":"Bucharest","country":"Romania","postcode":"010321"}'::jsonb),
  ('stats',     '{"clients":"50,000+","successRate":"98%","years":"15+","countries":"30+"}'::jsonb)
on conflict (key) do nothing;

-- Seed vacancies against the seeded countries and categories.
insert into public.jobs (title, slug, country_id, category_id, employment_type, description, salary_min, salary_max, vacancies, experience_required, accommodation_provided, status, is_featured, deadline)
select
  v.title, v.slug, c.id, cat.id, v.employment_type::public.employment_type, v.description,
  v.salary_min, v.salary_max, v.vacancies, v.experience_required, v.accommodation, 'open'::public.job_status, true, v.deadline::date
from (values
  ('Software Engineer',       'software-engineer-bucharest',   'romania',     'it-software',  'full_time', 'Backend engineering for EU payment infrastructure. Full relocation and work permit sponsorship provided.', 40000, 60000, 4,  3, false, '2026-11-30'),
  ('Healthcare Professional', 'healthcare-professional-cluj',  'romania',     'healthcare',   'full_time', 'Registered nurses and allied health professionals across surgical and intensive care wards.',              35000, 50000, 12, 2, true,  '2026-12-15'),
  ('Marketing Manager',       'marketing-manager-berlin',      'germany',     'marketing',    'full_time', 'Lead EU campaign strategy for a consumer brand portfolio. Salary above the EU Blue Card threshold.',       55000, 75000, 1,  5, false, '2026-10-31'),
  ('Financial Analyst',       'financial-analyst-amsterdam',   'netherlands', 'finance',      'full_time', 'FP&A role with an IND recognised sponsor — highly skilled migrant permits decided within four weeks.',     50000, 70000, 2,  3, false, '2026-11-15'),
  ('Warehouse Operative',     'warehouse-operative-poland',    'poland',      'logistics',    'full_time', 'Large-scale intake for distribution centre operations. Training, accommodation and transport provided.',   14000, 19000, 40, 0, true,  '2026-12-31'),
  ('Hospitality Team Member', 'hospitality-staff-malta',       'malta',       'hospitality',  'full_time', 'Front-of-house and food & beverage roles across four-star properties. English is the working language.',   16000, 24000, 25, 1, true,  '2026-10-15')
) as v(title, slug, country_slug, category_slug, employment_type, description, salary_min, salary_max, vacancies, experience_required, accommodation, deadline)
join public.countries c on c.slug = v.country_slug
join public.job_categories cat on cat.slug = v.category_slug
on conflict (slug) do nothing;

insert into public.blog_posts (title, slug, excerpt, content, tags, is_published, published_at) values
  ('Romania sets its 2026 work permit quota — what it means for applicants',
   'romania-work-permit-quota-2026',
   'The government has approved the annual quota for newly admitted foreign workers. Here is how quotas are consumed through the year and why filing early matters.',
   'Romania sets an annual ceiling on newly admitted non-EU workers, consumed first-come first-served as employers file with the General Inspectorate for Immigration. Files submitted in the first half of the year face shorter queues. If your employer has confirmed a role, get your documents legalised early — criminal record and medical certificates have limited validity, so sequence them last.',
   array['Romania','Work permit','Policy'], true, '2026-08-18'),
  ('EU Blue Card: lower salary thresholds and easier switching',
   'eu-blue-card-changes',
   'The revised Blue Card directive has been transposed across most member states. Shorter contracts now qualify, and moving between EU countries is simpler.',
   'The recast directive lowers the minimum contract to six months and reduces the salary threshold member states may set. It also improves intra-EU mobility: after 12 months in the first member state, holders can move under a simplified procedure. Recognition of qualifications remains the practical bottleneck — check Anabin for Germany, and confirm IND recognised sponsor status for the Netherlands.',
   array['EU','Blue Card','Skilled migration'], true, '2026-07-02'),
  ('The five documents that delay most visa applications',
   'documents-that-delay-applications',
   'After 15 years and 50,000 files, the same five documents cause most avoidable delays. Here is how to get each one right the first time.',
   'First, the apostille: a criminal record certificate without one is not accepted anywhere in the EU. Second, sworn translations by a translator authorised in the destination country. Third, proof of accommodation showing the correct address and a term covering the stay. Fourth, six months of stamped bank statements with a stable balance. Fifth, a passport valid three months beyond departure, with two blank pages, issued within the last ten years.',
   array['Documents','Practical guide'], true, '2026-06-11')
on conflict (slug) do nothing;
