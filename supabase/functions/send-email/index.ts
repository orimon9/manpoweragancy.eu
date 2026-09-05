// Authenticated transactional email sender. verify_jwt = true.
// Only staff may send to an arbitrary address; anyone may trigger their own welcome mail.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, preflight } from "../_shared/cors.ts";
import { sendEmail, type EmailTemplate } from "../_shared/email.ts";

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const pre = preflight(req);
  if (pre) return pre;

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization header" }, 401, origin);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return json({ error: "Not authenticated" }, 401, origin);

    const body = (await req.json()) as { to: string; template: EmailTemplate };
    if (!body?.to || !body?.template?.kind) return json({ error: "to and template are required" }, 400, origin);

    const { data: isStaff } = await supabase.rpc("is_staff", { _user_id: user.id });

    if (!isStaff && body.to.toLowerCase() !== (user.email ?? "").toLowerCase()) {
      console.warn("[send-email] blocked cross-user send by", user.id);
      return json({ error: "You may only send to your own address" }, 403, origin);
    }

    const result = await sendEmail(body.to, body.template);
    console.info("[send-email] sent", body.template.kind, "to", body.to);
    return json({ ok: true, result }, 200, origin);
  } catch (error) {
    console.error("[send-email] unhandled", error);
    return json({ error: "Unexpected error" }, 500, origin);
  }
});
