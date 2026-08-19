import { notFound } from "next/navigation";
import { updateTransportRequest } from "@/app/requests/actions";
import { Header } from "@/components/header";
import { TransportRequestForm } from "@/components/transport-request-form";
import { requireUser } from "@/lib/auth";

export default async function EditRequestPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params; const { supabase, user } = await requireUser(`/requests/${id}/edit`);
  const { data: request } = await supabase.from("transport_requests").select("id, passenger_id, direction, travel_date, preferred_time, flexibility_type, date_flexibility, time_flexibility, pickup, dropoff, notes").eq("id", id).eq("passenger_id", user.id).single();
  if (!request) notFound();
  const local = new Date(`${request.travel_date}T${request.preferred_time}`).toISOString();
  const { error } = await searchParams;
  return <div className="min-h-screen bg-stone-50"><Header /><main className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><p className="eyebrow">Traveler tools</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">Edit request</h1>{error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<TransportRequestForm action={updateTransportRequest} initial={{ id, direction: request.direction, flexibilityType: request.flexibility_type, date: local.slice(0, 10), time: local.slice(11, 16), pickup: request.pickup, dropoff: request.dropoff, notes: request.notes }} /></main></div>;
}
