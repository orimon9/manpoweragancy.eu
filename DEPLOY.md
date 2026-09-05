# Deploying to your own domain

The site is a static SPA. It builds to `dist/` and can be served by any web host.
Everything below assumes you have replaced `YOURDOMAIN.com` with your real domain.

---

## 1. Set the canonical URL (do this first)

One environment variable drives the canonical tags, the sitemap, `robots.txt`, and the
Open Graph image URL used in link previews. Create `.env.production` in the project root:

```
VITE_SITE_URL=https://YOURDOMAIN.com
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

If you skip `VITE_SUPABASE_*`, the public site still works — the portal areas show the
"backend not connected" page. Everything in this file is safe to expose; the service role
key never belongs here.

Then build:

```bash
npm ci
npm run build
```

`dist/` is what you upload. Confirm the substitution worked:

```bash
grep 'og:url' dist/index.html
```

It must show your domain, not `manpoweragancyeu.lovable.app`.

---

## 2. Pick a host

### Option A — cPanel / shared hosting (typical when the domain came with hosting)

1. Build locally, then zip the **contents** of `dist/` (not the folder itself).
2. In cPanel → File Manager, open `public_html/` and delete any placeholder `index.html`.
3. Upload the zip, then Extract.
4. Confirm `.htaccess` made it across — File Manager hides dotfiles until you tick
   **Settings → Show Hidden Files**. Without it every route except `/` returns 404.
5. cPanel → SSL/TLS Status → run AutoSSL for the domain.

The included [`public/.htaccess`](public/.htaccess) handles the SPA fallback, forces HTTPS,
sets one-year immutable caching on hashed assets, keeps `index.html` uncached, and adds
security headers.

### Option B — Netlify

Connect the Git repo, or drag `dist/` onto the deploy page. [`netlify.toml`](netlify.toml)
already sets the build command, publish directory, redirects and headers. Add
`VITE_SITE_URL` and the Supabase vars under Site settings → Environment variables, then
Domain management → Add custom domain.

### Option C — Vercel

Import the repo. [`vercel.json`](vercel.json) sets the rewrites and headers. Add the same
environment variables under Settings → Environment Variables, then Settings → Domains.

### Option D — Cloudflare Pages

Build command `npm run build`, output directory `dist`. `public/_redirects` supplies the
SPA fallback.

### Option E — your own nginx server

```nginx
server {
  listen 443 ssl http2;
  server_name YOURDOMAIN.com www.YOURDOMAIN.com;
  root /var/www/manpower/dist;
  index index.html;

  # SPA fallback — required.
  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location = /index.html {
    add_header Cache-Control "no-cache, must-revalidate";
  }

  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
}
```

---

## 3. DNS

At your registrar, point the domain at the host:

| Host | Record |
|---|---|
| cPanel / VPS | `A` record `@` → your server IP, and `CNAME` `www` → `YOURDOMAIN.com` |
| Netlify | `CNAME` `www` → `<site>.netlify.app`, plus their ALIAS/ANAME for the apex |
| Vercel | `A` `@` → `76.76.21.21`, `CNAME` `www` → `cname.vercel-dns.com` |
| Cloudflare Pages | `CNAME` both `@` and `www` → `<project>.pages.dev` |

Pick **one** canonical hostname (with or without `www`) and 301-redirect the other, or
search engines will index both and split your ranking.

DNS propagation is usually minutes but can take up to 48 hours.

---

## 4. If Supabase is connected

Three settings must know your new domain, or auth and the contact form break in production:

1. **Auth → URL Configuration** — set Site URL to `https://YOURDOMAIN.com` and add
   `https://YOURDOMAIN.com/**` to Redirect URLs. Without this, email confirmation and
   Google sign-in bounce back to localhost.
2. **Google OAuth console** — add `https://<ref>.supabase.co/auth/v1/callback` as an
   authorised redirect URI.
3. **Edge function secret** — `npx supabase secrets set ALLOWED_ORIGINS=https://YOURDOMAIN.com`
   so the contact form's CORS check passes. Leaving it as `*` also works but is looser than
   it needs to be.

---

## 5. After the first deploy

- [ ] Hard-refresh on a deep link (`/services/work-permit-visa`) — it must render, not 404.
      This is the single most common static-hosting mistake.
- [ ] `https://YOURDOMAIN.com/robots.txt` and `/sitemap.xml` load and show your domain.
- [ ] Paste the URL into the
      [Facebook sharing debugger](https://developers.facebook.com/tools/debug/) and
      [LinkedIn post inspector](https://www.linkedin.com/post-inspector/) — the logo and
      description should appear.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Test the contact form end to end and confirm the enquiry lands in Supabase.
- [ ] Check the site on a phone.

---

## Redeploying

```bash
git pull
npm ci
npm run build
```

Then re-upload `dist/` (or push, if the host builds from Git). Asset filenames are
content-hashed, so returning visitors pick up changes immediately without a cache purge —
provided `index.html` itself is served uncached, which every config here does.

---

## A note on link previews

React renders the per-page titles and descriptions in the browser. Google executes
JavaScript and indexes them correctly, but Facebook, LinkedIn and WhatsApp scrapers do not.
`index.html` therefore carries static Open Graph tags describing the homepage, injected at
build time from `VITE_SITE_URL`. Every shared link gets that preview.

If per-page previews matter later — a specific job ad sharing its own title and salary —
that needs prerendering or SSR, which is a change of hosting model (Vercel/Netlify
functions, or moving to Next.js). It is not something a static host can do.
