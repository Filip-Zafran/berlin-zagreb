"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function startConversation(formData: FormData) {
  const tripId = String(formData.get("tripId") ?? "");
  const { supabase, user } = await requireUser(`/trips/${tripId}`);
  const { data: trip } = await supabase.from("trips").select("driver_id").eq("id", tripId).single();
  if (!trip) redirect(`/?error=${encodeURIComponent("This trip is no longer available.")}`);
  if (trip.driver_id === user.id) redirect(`/trips/${tripId}?error=${encodeURIComponent("You cannot message yourself about your own trip.")}`);

  const { data: existing } = await supabase.from("conversations").select("id").eq("trip_id", tripId).eq("passenger_id", user.id).maybeSingle();
  if (existing) redirect(`/chat/${existing.id}`);
  const { data, error } = await supabase.from("conversations").insert({ trip_id: tripId, passenger_id: user.id }).select("id").single();
  if (error) redirect(`/trips/${tripId}?error=${encodeURIComponent(error.message)}`);
  redirect(`/chat/${data.id}`);
}
