import Link from "next/link";
import { deleteTrip } from "@/app/trips/actions";
import { Header } from "@/components/header";
import { requireUser } from "@/lib/auth";

const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  const { supabase, user } = await requireUser("/dashboard");
  const { data: trips } = await supabase.from("trips").select("id, direction, departure_at, car_model").eq("driver_id", user.id).order("departure_at");
  const query = await searchParams;
  return <div className="min-h-screen bg-stone-50"><Header /><main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    {(query.message || query.error) && <p className={`mb-6 rounded-xl border px-4 py-3 text-sm ${query.error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{query.error ?? query.message}</p>}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Your dashboard</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">Plan your journeys</h1><p className="mt-3 text-slate-500">Signed in as {user.email}</p></div><div className="flex gap-2"><Link href="/profile" className="focus-ring rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">Profile</Link><Link href="/trips/new" className="focus-ring rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Offer a trip</Link></div></div>
    <div className="mt-10 grid items-start gap-5 lg:grid-cols-2"><section className="rounded-3xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-950">My trips</h2><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{trips?.length ?? 0}</span></div>
      {trips?.length ? <ul className="mt-5 space-y-3">{trips.map((trip) => <li key={trip.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-bold text-slate-900">{trip.direction === "berlin-zagreb" ? "Berlin → Zagreb" : "Zagreb → Berlin"}</p><p className="mt-1 text-sm text-slate-500">{date.format(new Date(trip.departure_at))} · {trip.car_model}</p><div className="mt-4 flex gap-2"><Link href={`/trips/${trip.id}/edit`} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Edit</Link><form action={deleteTrip}><input type="hidden" name="id" value={trip.id} /><button className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700" type="submit">Delete</button></form></div></li>)}</ul> : <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-9 text-center"><p className="font-semibold text-slate-700">No published trips yet</p><p className="mt-1 text-sm text-slate-500">Offer your first trip when you know your travel date.</p></div>}
    </section><section className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-slate-950">My chats</h2><div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-9 text-center"><p className="font-semibold text-slate-700">No chats yet</p><p className="mt-1 text-sm text-slate-500">Private conversations arrive in Stage 5.</p></div></section></div>
  </main></div>;
}
