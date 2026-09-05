// Database webhook target: applications UPDATE.
// Sends the status email and writes a notifications row.
// Configure in Supabase → Database → Webhooks, and set verify_jwt = false with
// a shared secret in the WEBHOOK_SECRET header instead.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, preflight } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/email.ts";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  documents_required: "Documents required",
  interview_scheduled: "Interview scheduled",
  approved: "Approved",
  visa_processing: "Visa processing",
  deployed: "Deployed",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

type WebhookPayload = {
  type: "UPDATE";
  record: { id: string; applicant_id: string; reference_code: string; status: string };
  old_record: { status: string } | null;
};

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const pre = preflight(req);
  if (pre) return pre;

  const expected = Deno.env.get("WEBHOOK_SECRET");
  if (expected && req.headers.get("x-webhook-secret") !== expected) {
    console.warn("[on-status-change] rejected: bad webhook secret");
    return json({ error: "Forbidden" }, 403, origin);
  }

  try {
    const payload = (await req.json()) as WebhookPayload;
    const { record, old_record } = payload;

    if (!record || record.status === old_record?.status) {
      return json({ ok: true, skipped: "status unchanged" }, 200, origin);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", record.applicant_id)
      .maybeSingle();

    const label = STATUS_LABELS[record.status] ?? record.status;

    const { error: notifyError } = await supabase.from("notifications").insert({
      user_id: record.applicant_id,
      title: "Application " + record.reference_code + " is now " + label,
      body: "Open your dashboard to see the full timeline.",
      link: "/dashboard/applications/" + record.id,
      type: "status_change",
    });

    if (notifyError) console.error("[on-status-change] notification insert failed", notifyError.message);

    if (profile?.email) {
      await sendEmail(profile.email, {
        kind: "status_changed",
        name: profile.full_name ?? "there",
        reference: record.reference_code,
        status: label,
      });
    }

    console.info("[on-status-change] processed", record.reference_code, "->", record.status);
    return json({ ok: true }, 200, origin);
  } catch (error) {
    console.error("[on-status-change] unhandled", error);
    return json({ error: "Unexpected error" }, 500, origin);
  }
});
