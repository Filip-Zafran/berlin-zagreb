import { updateProfile } from "@/app/profile/actions";
import { Header } from "@/components/header";
import { inputClass, submitClass } from "@/components/auth-shell";
import { requireUser } from "@/lib/auth";

export default async function EditProfilePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { supabase, user } = await requireUser("/profile/edit");
  const { data: profile } = await supabase.from("profiles").select("first_name, bio, languages, car").eq("id", user.id).single();
  const { error } = await searchParams;
  return <div className="min-h-screen bg-stone-50"><Header /><main className="mx-auto max-w-2xl px-4 py-10 sm:px-6"><p className="eyebrow">Profile</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">Edit your profile</h1>
    <form action={updateProfile} className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8" encType="multipart/form-data">
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <label className="block text-sm font-bold text-slate-700">First name<input className={inputClass} name="firstName" required defaultValue={profile?.first_name ?? ""} /></label>
      <label className="block text-sm font-bold text-slate-700">Profile picture<input className={`${inputClass} py-3 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:font-semibold`} name="avatar" type="file" accept="image/jpeg,image/png,image/webp" /></label>
      <label className="block text-sm font-bold text-slate-700">Short bio<textarea className={`${inputClass} min-h-28 py-3`} name="bio" maxLength={500} defaultValue={profile?.bio ?? ""} /></label>
      <label className="block text-sm font-bold text-slate-700">Languages<input className={inputClass} name="languages" defaultValue={profile?.languages?.join(", ") ?? ""} placeholder="Croatian, German, English" /><span className="mt-2 block text-xs font-normal text-slate-400">Separate languages with commas.</span></label>
      <label className="block text-sm font-bold text-slate-700">Car (optional)<input className={inputClass} name="car" defaultValue={profile?.car ?? ""} placeholder="Volkswagen Passat" /></label>
      <button className={submitClass} type="submit">Save profile</button>
    </form></main></div>;
}
