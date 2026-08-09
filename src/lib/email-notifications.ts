import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getSiteUrl } from "@/lib/site-url";

export async function sendEmailNotification(userId: string, subject: string, message: string, path: string) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const brevoKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.NOTIFICATION_FROM_EMAIL;
  if (!serviceKey || !brevoKey || !senderEmail) return;

  try {
    const { url } = getSupabaseConfig();
    const admin = createSupabaseClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data } = await admin.auth.admin.getUserById(userId);
    const recipient = data.user?.email;
    if (!recipient) return;

    const link = `${getSiteUrl()}${path}`;
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevoKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Berlin Zagreb Transport", email: senderEmail },
        to: [{ email: recipient }],
        subject,
        htmlContent: `<p>${message}</p><p><a href="${link}">Open conversation</a></p>`,
      }),
    });
  } catch {
    // A temporary email-provider failure must not prevent chat delivery.
  }
}
