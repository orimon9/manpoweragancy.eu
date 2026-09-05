import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { company, countries, services } from "@/content/site";

/* lucide-react dropped brand marks, so these two are inlined. */
function FacebookMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable="false">
      <path d="M14 8.5V7c0-.83.67-1 1.5-1H17V3h-2.5A3.5 3.5 0 0 0 11 6.5v2H9V12h2v9h3v-9h2.5l.5-3.5H14Z" />
    </svg>
  );
}

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable="false">
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.25 8.5h3.5V21h-3.5V8.5Zm6 0h3.35v1.71h.05c.47-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.2 4.18 5.07V21h-3.5v-6.05c0-1.44-.03-3.3-2.05-3.3-2.05 0-2.36 1.57-2.36 3.19V21h-3.5V8.5h.53Z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold">{company.name}</span>
              <span className="block text-xs text-brand-foreground/70">SRL</span>
            </span>
          </div>
          <p className="mt-5 text-sm text-brand-foreground/75">
            Your trusted partner for international recruitment, visa processing, and global opportunities across EU and
            non-EU countries.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={company.facebook}
              className="grid h-10 w-10 place-items-center rounded-md bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Facebook"
              rel="noreferrer noopener"
              target="_blank"
            >
              <FacebookMark className="h-4 w-4" />
            </a>
            <a
              href={company.linkedin}
              className="grid h-10 w-10 place-items-center rounded-md bg-white/10 transition-colors hover:bg-white/20"
              aria-label="LinkedIn"
              rel="noreferrer noopener"
              target="_blank"
            >
              <LinkedInMark className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg text-brand-foreground">Our Services</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {services.slice(0, 5).map((service) => (
              <li key={service.slug}>
                <Link to={"/services/" + service.slug} className="text-brand-foreground/75 hover:text-brand-foreground">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg text-brand-foreground">Destinations</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {countries.slice(0, 5).map((country) => (
              <li key={country.slug}>
                <Link to={"/countries/" + country.slug} className="text-brand-foreground/75 hover:text-brand-foreground">
                  {country.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/countries" className="text-accent hover:underline">
                All destinations
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg text-brand-foreground">Contact Us</h2>
          <ul className="mt-5 space-y-4 text-sm text-brand-foreground/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <span>
                {company.address.street}
                <br />
                {company.address.city}, {company.address.country}, {company.address.postcode}
              </span>
            </li>
            {company.phones.map((phone) => (
              <li key={phone} className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                <a href={"tel:" + phone.replace(/[\s-]/g, "")} className="hover:text-brand-foreground">
                  {phone}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              <a href={"mailto:" + company.email} className="hover:text-brand-foreground">
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm text-brand-foreground/70 md:flex-row">
          <p>
            © {year} {company.legalName}. All rights reserved. Reg. {company.regNumber}
          </p>
          <nav className="flex gap-6" aria-label="Legal">
            <Link to="/privacy" className="hover:text-brand-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-brand-foreground">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-brand-foreground">
              Cookie Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
