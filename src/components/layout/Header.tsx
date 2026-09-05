import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Globe, Mail, Menu, Moon, Phone, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/Logo";
import { company, countries, services } from "@/content/site";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Departments", to: "/departments" },
  { label: "Opportunities", to: "/jobs" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("mga-theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("mga-theme", theme);
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState<"services" | "countries" | null>(null);
  const { theme, toggle } = useTheme();
  const { user, roles } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setMegaMenu(null);
  }, [location.pathname]);

  const dashboardPath = roles.includes("admin") || roles.includes("staff") ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-brand text-brand-foreground md:block">
        <div className="container flex h-11 items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a className="flex items-center gap-2 hover:underline" href={"tel:" + company.phones[0].replace(/\s/g, "")}>
              <Phone className="h-4 w-4" aria-hidden />
              {company.phones[0]}
            </a>
            <a className="flex items-center gap-2 hover:underline" href={"mailto:" + company.email}>
              <Mail className="h-4 w-4" aria-hidden />
              {company.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" aria-hidden />
            <span>{company.address.country}, EU</span>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-[72px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" aria-label={company.legalName + " home"}>
            <LogoMark />
            <span className="leading-tight">
              <span className="block whitespace-nowrap font-display text-sm font-bold sm:text-lg">{company.name}</span>
              <span className="block text-xs text-muted-foreground">SRL</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => {
              const isMega = item.label === "Services" || item.label === "Opportunities";
              const key = item.label === "Services" ? "services" : "countries";
              return (
                <div
                  key={item.to}
                  onMouseEnter={() => isMega && setMegaMenu(key as "services" | "countries")}
                  onMouseLeave={() => isMega && setMegaMenu(null)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors xl:px-4",
                        isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label={"Switch to " + (theme === "dark" ? "light" : "dark") + " theme"}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {user ? (
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link to={dashboardPath}>My dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link to="/track">Track Application</Link>
              </Button>
            )}
            <Button asChild variant="accent" className="hidden sm:inline-flex">
              <Link to="/apply">Apply Now</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {megaMenu ? (
          <div
            className="absolute inset-x-0 hidden border-b border-border bg-card shadow-e2 lg:block"
            onMouseEnter={() => setMegaMenu(megaMenu)}
            onMouseLeave={() => setMegaMenu(null)}
          >
            <div className="container grid gap-6 py-8 md:grid-cols-4">
              {megaMenu === "services"
                ? services.slice(0, 8).map((service) => (
                    <Link
                      key={service.slug}
                      to={"/services/" + service.slug}
                      className="rounded-md p-3 transition-colors hover:bg-secondary"
                    >
                      <span className="block font-semibold">{service.title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{service.shortDescription}</span>
                    </Link>
                  ))
                : countries.slice(0, 8).map((country) => (
                    <Link
                      key={country.slug}
                      to={"/countries/" + country.slug}
                      className="rounded-md p-3 transition-colors hover:bg-secondary"
                    >
                      <span className="block font-semibold">
                        <span aria-hidden>{country.flag}</span> {country.name}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{country.processingTime}</span>
                    </Link>
                  ))}
            </div>
          </div>
        ) : null}
      </div>

      {open ? (
        <div id="mobile-nav" className="border-b border-border bg-card lg:hidden">
          <nav className="container flex flex-col py-4" aria-label="Mobile">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn("rounded-md px-3 py-3 text-base font-medium", isActive ? "bg-secondary" : "text-muted-foreground")
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button asChild variant="outline">
                <Link to={user ? dashboardPath : "/track"}>{user ? "My dashboard" : "Track Application"}</Link>
              </Button>
              <Button asChild variant="accent">
                <Link to="/apply">Apply Now</Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
