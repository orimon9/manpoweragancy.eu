const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = Deno.env.get("MAIL_FROM") ?? "Manpower Global Agency <noreply@manpowerglobalagency.eu>";
export const AGENCY_INBOX = Deno.env.get("AGENCY_INBOX") ?? "info.fiaeurope@gmail.com";

export type EmailTemplate =
  | { kind: "welcome"; name: string }
  | { kind: "application_received"; name: string; reference: string }
  | { kind: "status_changed"; name: string; reference: string; status: string }
  | { kind: "documents_required"; name: string; reference: string; missing: string[] }
  | { kind: "appointment_confirmed"; name: string; when: string; location: string }
  | { kind: "inquiry_autoreply"; name: string }
  | { kind: "inquiry_alert"; name: string; email: string; message: string };

function layout(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f6f8;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#1b2733">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
      <tr><td style="background:#1b3a5c;padding:24px 32px;color:#ffffff">
        <strong style="font-size:18px">Manpower Global Agency SRL</strong>
      </td></tr>
      <tr><td style="padding:32px">
        <h1 style="margin:0 0 16px;font-size:20px">${title}</h1>
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:20px 32px;background:#f4f6f8;font-size:12px;color:#5b6b7c">
        Bd. General Gheorghe Magheru, Etaj-05, Sector-01, Bucharest, Romania 010321<br>
        You are receiving this because you contacted us or opened an application.
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

export function render(template: EmailTemplate): { subject: string; html: string } {
  switch (template.kind) {
    case "welcome":
      return {
        subject: "Welcome to Manpower Global Agency",
        html: layout(
          "Welcome, " + template.name,
          "<p>Your account is ready. Sign in to complete your profile, upload documents and track every application in one place.</p>"
        ),
      };
    case "application_received":
      return {
        subject: "Application received — " + template.reference,
        html: layout(
          "We have your application",
          "<p>Hello " + template.name + ",</p><p>Your reference code is <strong style=\"font-size:18px\">" +
            template.reference +
            "</strong>. Keep it safe — it identifies your file in every message we send.</p><p>A consultant will review your documents and come back to you within one working day.</p>"
        ),
      };
    case "status_changed":
      return {
        subject: "Status update — " + template.reference,
        html: layout(
          "Your application status changed",
          "<p>Hello " + template.name + ",</p><p>Application <strong>" + template.reference +
            "</strong> is now: <strong>" + template.status + "</strong>.</p><p>Sign in to your dashboard for the full timeline.</p>"
        ),
      };
    case "documents_required":
      return {
        subject: "Documents needed — " + template.reference,
        html: layout(
          "We need a few more documents",
          "<p>Hello " + template.name + ",</p><p>To move <strong>" + template.reference +
            "</strong> forward we still need:</p><ul>" +
            template.missing.map((item) => "<li>" + item + "</li>").join("") +
            "</ul><p>Upload them in your dashboard under Documents.</p>"
        ),
      };
    case "appointment_confirmed":
      return {
        subject: "Appointment confirmed",
        html: layout(
          "Your appointment is booked",
          "<p>Hello " + template.name + ",</p><p><strong>" + template.when + "</strong><br>" + template.location + "</p>"
        ),
      };
    case "inquiry_autoreply":
      return {
        subject: "We received your message",
        html: layout(
          "Thank you for getting in touch",
          "<p>Hello " + template.name +
            ",</p><p>Your message is with our team and a consultant will reply within one working day. For anything urgent, WhatsApp us on +40 734 304 768.</p>"
        ),
      };
    case "inquiry_alert":
      return {
        subject: "New website enquiry — " + template.name,
        html: layout(
          "New enquiry",
          "<p><strong>" + template.name + "</strong> (" + template.email + ")</p><p>" +
            template.message.replace(/</g, "&lt;") + "</p>"
        ),
      };
  }
}

export async function sendEmail(to: string, template: EmailTemplate) {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to", to);
    return { skipped: true };
  }

  const { subject, html } = render(template);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[email] send failed", response.status, detail);
    throw new Error("Email delivery failed with status " + response.status);
  }

  return await response.json();
}
