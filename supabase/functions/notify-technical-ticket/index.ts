import { createClient } from "npm:@supabase/supabase-js@2";

type TicketRecord = {
  id: string;
  contact_email: string;
  category: string;
  description: string;
  screenshot_path: string;
  page_url: string;
  created_at: string;
};

type InsertPayload = {
  type: "INSERT";
  table: string;
  schema: string;
  record: TicketRecord;
  old_record: null;
};

const categoryLabels: Record<string, string> = {
  "registration-login": "Registration or login",
  "trips-requests": "Trips or transport requests",
  messages: "Messages",
  "profile-account": "Profile or account",
  other: "Something else",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const expectedSecret = Deno.env.get("TECHNICAL_TICKET_WEBHOOK_SECRET");
  const receivedSecret = request.headers.get("x-webhook-secret");
  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!resendApiKey || !supabaseUrl || !serviceRoleKey) {
    return new Response("Function secrets are not configured", { status: 500 });
  }

  let payload: InsertPayload;
  try {
    payload = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (payload.type !== "INSERT" || payload.schema !== "public" || payload.table !== "technical_support_tickets" || !payload.record) {
    return new Response("Unexpected webhook payload", { status: 400 });
  }

  const ticket = payload.record;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: screenshot } = await supabase.storage
    .from("technical-ticket-screenshots")
    .createSignedUrl(ticket.screenshot_path, 60 * 60 * 24 * 7);

  const category = categoryLabels[ticket.category] ?? ticket.category;
  const screenshotLink = screenshot?.signedUrl
    ? `<p style="margin:24px 0 0"><a href="${escapeHtml(screenshot.signedUrl)}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">View screenshot</a></p><p style="color:#64748b;font-size:12px">This private link expires in 7 days.</p>`
    : "<p><strong>Screenshot:</strong> Open the technical-ticket-screenshots bucket in Supabase.</p>";

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: Deno.env.get("TECHNICAL_TICKET_FROM_EMAIL") ?? "Berlin Zagreb Transport <onboarding@resend.dev>",
      to: [Deno.env.get("TECHNICAL_TICKET_TO_EMAIL") ?? "filip.zafran@gmail.com"],
      reply_to: ticket.contact_email,
      subject: `[Technical ticket] ${category}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#0f172a;line-height:1.6">
          <p style="color:#64748b;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Berlin Zagreb Transport</p>
          <h1 style="font-size:24px;margin:8px 0 24px">New technical support ticket</h1>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#64748b;width:130px">Category</td><td style="padding:8px 0;font-weight:700">${escapeHtml(category)}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Contact</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(ticket.contact_email)}">${escapeHtml(ticket.contact_email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Page</td><td style="padding:8px 0"><a href="${escapeHtml(ticket.page_url)}">${escapeHtml(ticket.page_url)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Submitted</td><td style="padding:8px 0">${escapeHtml(new Date(ticket.created_at).toISOString())}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Ticket ID</td><td style="padding:8px 0;font-family:monospace">${escapeHtml(ticket.id)}</td></tr>
          </table>
          <h2 style="font-size:16px;margin:28px 0 8px">Description</h2>
          <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px">${escapeHtml(ticket.description)}</div>
          ${screenshotLink}
        </div>
      `,
    }),
  });

  const responseBody = await emailResponse.text();
  if (!emailResponse.ok) {
    console.error("Resend rejected ticket notification", emailResponse.status, responseBody);
    return new Response("Email delivery failed", { status: 502 });
  }

  return new Response(responseBody, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
