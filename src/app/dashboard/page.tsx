import { redirect } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { Header } from "@/components/header";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  if (!isSupabaseConfigured()) redirect("/login?error=Supabase credentials have not been added yet.");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");
  const { message } = await searchParams;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {message && <p className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">Your dashboard</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">Welcome to Via</h1><p className="mt-3 text-slate-500">Signed in as {user.email}</p></div>
          <form action={logout}><button type="submit" className="focus-ring min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 hover:bg-slate-100">Log out</button></form>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-slate-950">My trips</h2><p className="mt-3 text-sm leading-6 text-slate-500">Trip publishing and management arrive in Stage 4.</p></section>
          <section className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-slate-950">My chats</h2><p className="mt-3 text-sm leading-6 text-slate-500">Private conversations arrive in Stage 5.</p></section>
        </div>
      </main>
    </div>
  );
}
