import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "mga-cookie-consent";

type Consent = { necessary: true; analytics: boolean; marketing: boolean; decidedAt: string };

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function write(consent: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* storage unavailable — the banner simply reappears next visit */
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!read()) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (a: boolean, m: boolean) => {
    write({ necessary: true, analytics: a, marketing: m, decidedAt: new Date().toISOString() });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-5 shadow-e3"
    >
      <div className="container flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">We use cookies</p>
          <p className="mt-1">
            Necessary cookies keep you signed in and are always on. Analytics and marketing cookies are optional and off
            until you turn them on. Read our{" "}
            <Link to="/privacy" className="text-primary underline">
              privacy policy
            </Link>
            .
          </p>
          {showDetail ? (
            <fieldset className="mt-4 space-y-2">
              <legend className="sr-only">Optional cookie categories</legend>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked disabled className="h-4 w-4 accent-[hsl(var(--primary))]" />
                <span>Strictly necessary — session, security, load balancing</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                />
                <span>Analytics — anonymous usage statistics</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                />
                <span>Marketing — campaign measurement</span>
              </label>
            </fieldset>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="ghost" onClick={() => setShowDetail((s) => !s)}>
            {showDetail ? "Hide options" : "Manage options"}
          </Button>
          <Button variant="outline" onClick={() => decide(false, false)}>
            Reject non-essential
          </Button>
          {showDetail ? (
            <Button onClick={() => decide(analytics, marketing)}>Save choices</Button>
          ) : (
            <Button onClick={() => decide(true, true)}>Accept all</Button>
          )}
        </div>
      </div>
    </div>
  );
}
