"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSiteUrl } from "@/lib/site-url";

function authError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function readableAuthError(error: { code?: string; message: string }) {
  if (error.code === "over_email_send_rate_limit" || error.message.toLowerCase().includes("rate limit")) {
    return "Too many confirmation emails have been requested. Please wait about an hour before trying again, or contact the site administrator.";
  }
  return error.message;
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) authError("/login", "Supabase credentials have not been added yet.");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) authError("/login", error.message);
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function register(formData: FormData) {
  if (!isSupabaseConfigured()) authError("/register", "Supabase credentials have not been added yet.");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!firstName) authError("/register", "Please enter your first name.");
  if (password.length < 8) authError("/register", "Password must contain at least 8 characters.");

  const origin = getSiteUrl((await headers()).get("origin"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { first_name: firstName }, emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) authError("/register", readableAuthError(error));
  if (data.session) redirect("/dashboard");
  redirect("/login?message=Check your email to confirm your account.");
}

export async function requestPasswordReset(formData: FormData) {
  if (!isSupabaseConfigured()) authError("/forgot-password", "Supabase credentials have not been added yet.");
  const email = String(formData.get("email") ?? "").trim();
  const origin = getSiteUrl((await headers()).get("origin"));
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
  if (error) authError("/forgot-password", readableAuthError(error));
  redirect("/forgot-password?message=Check your email for a password reset link.");
}

export async function updatePassword(formData: FormData) {
  if (!isSupabaseConfigured()) authError("/reset-password", "Supabase credentials have not been added yet.");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) authError("/reset-password", "Password must contain at least 8 characters.");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) authError("/reset-password", error.message);
  redirect("/dashboard?message=Your password has been updated.");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
