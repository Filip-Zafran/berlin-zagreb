"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

function values(formData: FormData) {
  const direction = String(formData.get("direction"));
  const date = String(formData.get("date"));
  const time = String(formData.get("time"));
  const carModel = String(formData.get("carModel") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  let stops: string[] = [];
  try { stops = JSON.parse(String(formData.get("stops") ?? "[]")).map((item: unknown) => String(item).trim()).filter(Boolean); } catch { /* validation below */ }
  const validDirection = direction === "berlin-zagreb" || direction === "zagreb-berlin";
  if (!validDirection || !date || !time || !carModel) return { error: "Complete all required fields." } as const;
  const departureAt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(departureAt.getTime()) || departureAt <= new Date()) return { error: "Departure must be in the future." } as const;
  return { direction, departureAt: departureAt.toISOString(), carModel, notes, stops, startingCity: direction === "berlin-zagreb" ? "Berlin" : "Zagreb", destinationCity: direction === "berlin-zagreb" ? "Zagreb" : "Berlin" } as const;
}

export async function createTrip(formData: FormData) {
  const { supabase, user } = await requireUser("/trips/new");
  const parsed = values(formData);
  if ("error" in parsed && parsed.error) redirect(`/trips/new?error=${encodeURIComponent(parsed.error)}`);
  const { data: trip, error } = await supabase.from("trips").insert({ driver_id: user.id, direction: parsed.direction, departure_at: parsed.departureAt, car_model: parsed.carModel, starting_city: parsed.startingCity, destination_city: parsed.destinationCity, notes: parsed.notes }).select("id").single();
  if (error) redirect(`/trips/new?error=${encodeURIComponent(error.message)}`);
  if (parsed.stops.length) {
    const { error: stopsError } = await supabase.from("trip_stops").insert(parsed.stops.map((city, position) => ({ trip_id: trip.id, city, position })));
    if (stopsError) { await supabase.from("trips").delete().eq("id", trip.id); redirect(`/trips/new?error=${encodeURIComponent(stopsError.message)}`); }
  }
  revalidatePath("/"); revalidatePath("/dashboard");
  redirect("/dashboard?message=Trip published.");
}

export async function updateTrip(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await requireUser(`/trips/${id}/edit`);
  const parsed = values(formData);
  if ("error" in parsed && parsed.error) redirect(`/trips/${id}/edit?error=${encodeURIComponent(parsed.error)}`);
  const { error } = await supabase.from("trips").update({ direction: parsed.direction, departure_at: parsed.departureAt, car_model: parsed.carModel, starting_city: parsed.startingCity, destination_city: parsed.destinationCity, notes: parsed.notes }).eq("id", id).eq("driver_id", user.id);
  if (error) redirect(`/trips/${id}/edit?error=${encodeURIComponent(error.message)}`);
  await supabase.from("trip_stops").delete().eq("trip_id", id);
  if (parsed.stops.length) {
    const { error: stopsError } = await supabase.from("trip_stops").insert(parsed.stops.map((city, position) => ({ trip_id: id, city, position })));
    if (stopsError) redirect(`/trips/${id}/edit?error=${encodeURIComponent(stopsError.message)}`);
  }
  revalidatePath("/"); revalidatePath("/dashboard"); revalidatePath(`/trips/${id}`);
  redirect("/dashboard?message=Trip updated.");
}

export async function deleteTrip(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await requireUser("/dashboard");
  const { error } = await supabase.from("trips").delete().eq("id", id).eq("driver_id", user.id);
  if (error) redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/"); revalidatePath("/dashboard");
  redirect("/dashboard?message=Trip deleted.");
}
