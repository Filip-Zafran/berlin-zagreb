import { createTrip } from "@/app/trips/actions";
import { Header } from "@/components/header";
import { TripForm } from "@/components/trip-form";
import { requireUser } from "@/lib/auth";

export default async function NewTripPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireUser("/trips/new"); const { error } = await searchParams;
  return <div className="min-h-screen bg-stone-50"><Header /><main className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><p className="eyebrow">Driver tools</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">Offer a trip</h1><p className="mt-3 text-slate-500">Share when and how you plan to travel.</p>{error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<TripForm action={createTrip} /></main></div>;
}
