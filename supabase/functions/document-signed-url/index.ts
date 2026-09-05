// Returns a short-lived signed URL, but only after confirming the caller owns
// the document or is staff. verify_jwt = true.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, preflight } from "../_shared/cors.ts";

const TTL_SECONDS = 60;

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const pre = preflight(req);
  if (pre) return pre;

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization header" }, 401, origin);

    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) return json({ error: "Not authenticated" }, 401, origin);

    const { document_id: documentId } = (await req.json()) as { document_id?: string };
    if (!documentId) return json({ error: "document_id is required" }, 400, origin);

    // Read through the caller's own client so RLS decides visibility.
    const { data: document, error: docError } = await userClient
      .from("documents")
      .select("id, owner_id, file_path")
      .eq("id", documentId)
      .maybeSingle();

    if (docError) {
      console.error("[document-signed-url] lookup failed", docError.message);
      return json({ error: "Lookup failed" }, 500, origin);
    }
    if (!document) {
      // RLS already hid it; do not leak whether the id exists.
      return json({ error: "Not found" }, 404, origin);
    }

    const { data: isStaff } = await userClient.rpc("is_staff", { _user_id: user.id });
    if (document.owner_id !== user.id && !isStaff) {
      console.warn("[document-signed-url] blocked access by", user.id, "to", documentId);
      return json({ error: "Forbidden" }, 403, origin);
    }

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });

    const { data: signed, error: signError } = await admin.storage
      .from("documents")
      .createSignedUrl(document.file_path, TTL_SECONDS);

    if (signError || !signed) {
      console.error("[document-signed-url] signing failed", signError?.message);
      return json({ error: "Could not create link" }, 500, origin);
    }

    return json({ url: signed.signedUrl, expires_in: TTL_SECONDS }, 200, origin);
  } catch (error) {
    console.error("[document-signed-url] unhandled", error);
    return json({ error: "Unexpected error" }, 500, origin);
  }
});
