// Scheduled via pg_cron. Emails staff the pending document queue and any
// inquiry left unassigned for more than 24 hours.
//
//   select cron.schedule(
//     'daily-digest', '0 7 * * *',
//     $$select net.http_post(
//        url := 'https://<ref>.functions.supabase.co/daily-digest',
//        headers := jsonb_build_object('x-webhook-secret', '<WEBHOOK_SECRET>')
//      )$$
//   );
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, preflight } from "../_shared/cors.ts";
import { AGENCY_INBOX, sendEmail } from "../_shared/email.ts";

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const pre = preflight(req);
  if (pre) return pre;

  const expected = Deno.env.get("WEBHOOK_SECRET");
  if (expected && req.headers.get("x-webhook-secret") !== expected) {
    return json({ error: "Forbidden" }, 403, origin);
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [pendingDocs, staleInquiries] = await Promise.all([
      supabase.from("documents").select("id, doc_type, file_name, created_at").eq("status", "pending"),
      supabase.from("inquiries").select("id, full_name, email, created_at").is("assigned_to", null).lt("created_at", yesterday),
    ]);

    if (pendingDocs.error) throw pendingDocs.error;
    if (staleInquiries.error) throw staleInquiries.error;

    const docCount = pendingDocs.data?.length ?? 0;
    const inquiryCount = staleInquiries.data?.length ?? 0;

    if (docCount === 0 && inquiryCount === 0) {
      console.info("[daily-digest] nothing to report");
      return json({ ok: true, skipped: "queue clear" }, 200, origin);
    }

    const missing = [
      docCount + " document(s) waiting for verification",
      inquiryCount + " inquiry/inquiries unassigned for over 24 hours",
    ];

    await sendEmail(AGENCY_INBOX, {
      kind: "documents_required",
      name: "team",
      reference: "DAILY DIGEST",
      missing,
    });

    console.info("[daily-digest] sent", { docCount, inquiryCount });
    return json({ ok: true, docCount, inquiryCount }, 200, origin);
  } catch (error) {
    console.error("[daily-digest] unhandled", error);
    return json({ error: "Unexpected error" }, 500, origin);
  }
});
