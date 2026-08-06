"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireUser("/profile/edit");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const languages = String(formData.get("languages") ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  const car = String(formData.get("car") ?? "").trim() || null;
  if (!firstName) redirect("/profile/edit?error=First name is required.");

  let avatarPath: string | undefined;
  const avatar = formData.get("avatar");
  if (avatar instanceof File && avatar.size > 0) {
    if (avatar.size > 2 * 1024 * 1024) redirect("/profile/edit?error=Profile picture must be smaller than 2 MB.");
    if (!["image/jpeg", "image/png", "image/webp"].includes(avatar.type)) redirect("/profile/edit?error=Use a JPG, PNG, or WebP image.");
    const extension = avatar.name.split(".").pop()?.toLowerCase() || "jpg";
    avatarPath = `${user.id}/avatar-${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from("avatars").upload(avatarPath, avatar, { upsert: true, contentType: avatar.type });
    if (error) redirect(`/profile/edit?error=${encodeURIComponent(error.message)}`);
  }

  const updates: Record<string, unknown> = { first_name: firstName, bio, languages, car };
  if (avatarPath) updates.avatar_path = avatarPath;
  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) redirect(`/profile/edit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/profile");
  redirect("/profile?message=Profile updated.");
}
