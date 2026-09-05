// Public endpoint — set verify_jwt = false for this function.
// Honeypot + per-IP rate limit + zod validation, then insert and notify.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";
import { json, preflight } from "../_shared/cors.ts";
import { AGENCY_INBOX, sendEmail } from "../_shared/email.ts";

const schema = z.object({
  full_name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).nullish(),
  country_of_interest: z.string().max(120).nullish(),
  service_of_interest: z.string().max(120).nullish(),
  message: z.string().min(20).max(4000),
  source: z.string().max(80).nullish(),
  company_website: z.string().max(0).optional(), // honeypot
});

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const pre = preflight(req);
  if (pre) return pre;

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (rateLimited(ip)) {
      console.warn("[contact-inquiry] rate limited", ip);
      return json({ error: "Too many requests. Please try again in a minute." }, 429, origin);
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, 400, origin);
    }

    const payload = parsed.data;

    // Honeypot tripped: pretend success so the bot does not learn anything.
    if (payload.company_website) {
      console.info("[contact-inquiry] honeypot tripped", ip);
      return json({ ok: true }, 200, origin);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { error } = await supabase.from("inquiries").insert({
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone ?? null,
      country_of_interest: payload.country_of_interest ?? null,
      service_of_interest: payload.service_of_interest ?? null,
      message: payload.message,
      source: payload.source ?? "website",
      status: "new",
    });

    if (error) {
      console.error("[contact-inquiry] insert failed", error.message);
      return json({ error: "Could not store your message" }, 500, origin);
    }

    await Promise.allSettled([
      sendEmail(payload.email, { kind: "inquiry_autoreply", name: payload.full_name }),
      sendEmail(AGENCY_INBOX, {
        kind: "inquiry_alert",
        name: payload.full_name,
        email: payload.email,
        message: payload.message,
      }),
    ]);

    console.info("[contact-inquiry] stored inquiry from", payload.email);
    return json({ ok: true }, 200, origin);
  } catch (error) {
    console.error("[contact-inquiry] unhandled", error);
    return json({ error: "Unexpected error" }, 500, origin);
  }
});
