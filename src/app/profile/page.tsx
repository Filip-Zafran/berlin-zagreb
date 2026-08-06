import Link from "next/link";
import { Header } from "@/components/header";
import { ProfileAvatar } from "@/components/profile-avatar";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { supabase, user } = await requireUser("/profile");
  const { data: profile } = await supabase.from("profiles").select("first_name, avatar_path, bio, languages, car").eq("id", user.id).single();
  const name = profile?.first_name ?? "Traveller";
  const avatarUrl = profile?.avatar_path ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_path).data.publicUrl : null;
  const { message } = await searchParams;
  return <div className="min-h-screen bg-stone-50"><Header /><main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    {message && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><ProfileAvatar name={name} avatarUrl={avatarUrl} /><div><p className="eyebrow">Your profile</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{name}</h1><p className="mt-1 text-sm text-slate-500">{user.email}</p></div></div>
      <p className="mt-7 leading-7 text-slate-600">{profile?.bio || "Add a short bio so other travellers know a little about you."}</p>
      <dl className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2"><div><dt className="eyebrow">Languages</dt><dd className="mt-2 text-sm font-semibold text-slate-700">{profile?.languages?.length ? profile.languages.join(", ") : "Not added"}</dd></div><div><dt className="eyebrow">Car</dt><dd className="mt-2 text-sm font-semibold text-slate-700">{profile?.car || "Not added"}</dd></div></dl>
      <div className="mt-8 flex gap-3"><Link href="/profile/edit" className="focus-ring rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Edit profile</Link><Link href="/dashboard" className="focus-ring rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Dashboard</Link></div>
    </section>
  </main></div>;
}
