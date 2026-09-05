import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { company } from "@/content/site";

export function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />

      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 sm:hidden">
        <a
          href={"https://wa.me/" + company.whatsapp.replace(/[^0-9]/g, "")}
          className="grid h-14 w-14 place-items-center rounded-full bg-success text-success-foreground shadow-e3"
          aria-label="Chat on WhatsApp"
          rel="noreferrer noopener"
          target="_blank"
        >
          <MessageCircle className="h-6 w-6" aria-hidden />
        </a>
        <a
          href={"tel:" + company.phones[1].replace(/[\s-]/g, "")}
          className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-e3"
          aria-label="Call the agency"
        >
          <Phone className="h-6 w-6" aria-hidden />
        </a>
      </div>

      <CookieConsent />
    </div>
  );
}
