// Generates public/sitemap.xml and public/robots.txt from the published slugs.
// Runs automatically before `npm run build`.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const site = (process.env.VITE_SITE_URL ?? "https://manpoweragency.eu").replace(/\/$/, "");

// Kept in step with src/content/site.ts. When the content moves to Supabase,
// query the published rows here instead.
const services = [
  "work-permit-visa", "student-visa", "business-visa", "investor-visa",
  "family-reunification", "trc-extension", "permanent-residency", "non-eu-services",
];
const countries = [
  "romania", "poland", "croatia", "hungary", "portugal", "malta",
  "lithuania", "slovakia", "germany", "netherlands", "uae", "canada",
];
const jobs = [
  "software-engineer-bucharest", "healthcare-professional-cluj", "marketing-manager-berlin",
  "financial-analyst-amsterdam", "warehouse-operative-poland", "hospitality-staff-malta",
];
const posts = ["romania-work-permit-quota-2026", "eu-blue-card-changes", "documents-that-delay-applications"];

const routes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/countries", priority: "0.9", changefreq: "monthly" },
  { path: "/jobs", priority: "0.9", changefreq: "daily" },
  { path: "/departments", priority: "0.6", changefreq: "monthly" },
  { path: "/about", priority: "0.6", changefreq: "yearly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
  { path: "/apply", priority: "0.8", changefreq: "yearly" },
  { path: "/track", priority: "0.5", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/cookies", priority: "0.3", changefreq: "yearly" },
  ...services.map((slug) => ({ path: "/services/" + slug, priority: "0.8", changefreq: "monthly" })),
  ...countries.map((slug) => ({ path: "/countries/" + slug, priority: "0.8", changefreq: "monthly" })),
  ...jobs.map((slug) => ({ path: "/jobs/" + slug, priority: "0.7", changefreq: "weekly" })),
  ...posts.map((slug) => ({ path: "/blog/" + slug, priority: "0.6", changefreq: "monthly" })),
];

const today = new Date().toISOString().slice(0, 10);

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes
    .map(
      (route) =>
        "  <url>\n    <loc>" + site + route.path + "</loc>\n    <lastmod>" + today +
        "</lastmod>\n    <changefreq>" + route.changefreq + "</changefreq>\n    <priority>" +
        route.priority + "</priority>\n  </url>"
    )
    .join("\n") +
  "\n</urlset>\n";

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  "# Private areas — never index",
  "Disallow: /dashboard",
  "Disallow: /admin",
  "Disallow: /auth",
  "Disallow: /403",
  "",
  "Sitemap: " + site + "/sitemap.xml",
  "",
].join("\n");

mkdirSync(resolve(root, "public"), { recursive: true });
writeFileSync(resolve(root, "public/sitemap.xml"), sitemap, "utf8");
writeFileSync(resolve(root, "public/robots.txt"), robots, "utf8");

console.log("Wrote public/sitemap.xml (" + routes.length + " urls) and public/robots.txt for " + site);
