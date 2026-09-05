# Manpower Global Agency SRL

Recruitment and immigration platform for a Romania-registered agency operating across EU and non-EU
countries. Public marketing site, candidate portal, and staff console.

Built to the specification in `manpower-lovable-prompt-pack.md`:
React 19 + Vite + TypeScript (strict) + Tailwind + Supabase (Postgres, Auth, Storage, Realtime,
Edge Functions).

---

## Running it

```bash
npm install
npm run dev
```

The public site runs with no backend — pages fall back to the bundled content in
`src/content/site.ts`. The portal areas redirect to `/backend-required` until Supabase is connected.

## Connecting Supabase

1. Create a Supabase project, then copy `.env.example` to `.env.local` and fill in:

   ```
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```

   Only the anon key belongs here. The service role key lives in Edge Function secrets and must
   never reach the browser.

2. Run the migrations in order in the SQL editor:

   | File | What it does |
   |---|---|
   | `supabase/migrations/0001_schema.sql` | Enums, 18 tables, triggers, indexes, storage buckets, `ENABLE ROW LEVEL SECURITY` on every table |
   | `supabase/migrations/0002_rls.sql` | Role helpers, every policy, storage policies, the `applications_public` view |
   | `supabase/migrations/0003_seed.sql` | 12 countries, 8 job categories, 6 services, 10 FAQs, 6 testimonials, 6 vacancies, 3 posts |

3. Auth → Providers: enable Email (confirmations on) and Google.
   Auth → URL configuration: add your dev and production origins.

4. Deploy the edge functions and set their secrets:

   ```bash
   npx supabase functions deploy contact-inquiry send-email on-status-change document-signed-url daily-digest
   npx supabase secrets set RESEND_API_KEY=... WEBHOOK_SECRET=... AGENCY_INBOX=... ALLOWED_ORIGINS=https://your-domain
   ```

   `supabase/config.toml` already sets `verify_jwt` per function.

5. Database → Webhooks: point an `applications` UPDATE webhook at `on-status-change`, sending
   `x-webhook-secret`. Schedule `daily-digest` with `pg_cron` (example in the function header).

6. Give yourself the admin role once, from the SQL editor:

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'you@example.com';
   ```

---

## Security model

Roles live in `user_roles`, never on `profiles`, and every policy asks
`public.has_role(auth.uid(), 'x')` — a `SECURITY DEFINER` function — instead of selecting from
`user_roles` inside the policy. That is what avoids `infinite recursion detected in policy`, and it
means a user cannot escalate privileges by updating their own profile row.

The full table × command × role grid is in [`supabase/RLS-MATRIX.md`](supabase/RLS-MATRIX.md).

Three things worth knowing beyond the matrix:

- **`internal_notes` is protected twice.** RLS is row-level, so a candidate who can read their own
  application row could otherwise read the staff notes on it. The column privilege is revoked from
  `anon` and `authenticated`, and candidates read through `applications_public`, a
  `security_invoker = on` view that omits the column. (A view without `security_invoker` runs as its
  owner and would bypass RLS entirely — that is the trap this avoids.)
- **`application_events` is append-only.** There is no UPDATE or DELETE policy for anyone, so the
  audit trail cannot be rewritten.
- **Documents are never public.** The `documents` bucket is private, paths are `{user_id}/…`,
  storage policies check `(storage.foldername(name))[1] = auth.uid()::text`, and files are opened
  through 60-second signed URLs.

---

## Layout

```
src/
  components/ui/        design-system primitives (button, card, badge, input, alert, misc)
  components/layout/    Header, Footer, PublicLayout, PortalLayout, PageHero, CookieConsent
  content/site.ts       bundled public content + no-backend fallback
  lib/supabase.ts       client; null-safe when env vars are absent
  lib/database.types.ts hand-maintained mirror of the SQL schema
  lib/queries.ts        every TanStack Query hook and mutation
  pages/                public routes
  pages/dashboard/      candidate portal
  pages/admin/          staff console
  providers/            AuthProvider
  routes/               ProtectedRoute
supabase/
  migrations/           0001 schema · 0002 RLS · 0003 seed
  functions/            5 edge functions + shared cors/email helpers
  RLS-MATRIX.md         the permission grid
scripts/
  generate-sitemap.mjs  writes public/sitemap.xml + robots.txt, runs before build
```

### Design tokens

All colour, radius and shadow values are semantic tokens in `src/index.css`, surfaced through
`tailwind.config.ts`. No component hardcodes a Tailwind palette colour.

One token pair is worth calling out: `--brand` is the deep navy **surface** (hero, header bar,
footer, CTA panels) and is deliberately independent of `--primary`, the interactive colour. Primary
has to lighten in dark mode; the brand surface must stay dark or white-on-navy text breaks. The
`--brand-highlight` token exists for the same reason — accent text that has to stay legible on that
surface in both themes.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on :5173 |
| `npm run build` | sitemap → `tsc -b` → production build |
| `npm run typecheck` | TypeScript only |
| `npm run sitemap` | regenerate `public/sitemap.xml` and `robots.txt` |

## Status

Done: design system, public site (14 routes), auth with role-aware routing, candidate dashboard,
staff console, complete schema + RLS + seed, 5 edge functions, SEO (per-route meta, JSON-LD
Organization / Service / JobPosting / Article / BreadcrumbList, sitemap, robots), GDPR cookie
consent with granular categories, privacy/terms/cookie pages, explicit consent gate before any
document upload.

Not done, and left deliberately: i18n is single-language (English) — the route and copy structure is
ready for `react-i18next` but the six locale bundles are not written; the employer portal at
`/employer` is routed but not built; admin content editors (services, countries, blog) are read-only
lists rather than full CRUD; data export and account deletion are described in the privacy policy
but not yet wired to an endpoint.
