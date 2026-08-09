import { notFound } from "next/navigation";
import { updateTrip } from "@/app/trips/actions";
import { Header } from "@/components/header";
import { TripForm } from "@/components/trip-form";
import { requireUser } from "@/lib/auth";

export default async function EditTripPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params; const { supabase, user } = await requireUser(`/trips/${id}/edit`);
  const { data: trip } = await supabase.from("trips").select("id, direction, departure_at, car_model, price, pet_friendly, notes, trip_stops(city, position)").eq("id", id).eq("driver_id", user.id).single();
  if (!trip) notFound(); const departure = new Date(trip.departure_at); const local = new Date(departure.getTime() - departure.getTimezoneOffset() * 60000).toISOString(); const { error } = await searchParams;
  const stops = [...(trip.trip_stops ?? [])].sort((a, b) => a.position - b.position).map((stop) => stop.city);
  return <div className="min-h-screen bg-stone-50"><Header /><main className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><p className="eyebrow">Driver tools</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">Edit trip</h1>{error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<TripForm action={updateTrip} initial={{ id, direction: trip.direction, date: local.slice(0, 10), time: local.slice(11, 16), carModel: trip.car_model, price: trip.price, petFriendly: trip.pet_friendly, notes: trip.notes, stops }} /></main></div>;
}
