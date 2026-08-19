"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { parseFlexibility } from "@/lib/travel-flexibility";

export async function createTransportRequest(formData: FormData) {
  const { supabase, user } = await requireUser("/requests/new");
  const direction = String(formData.get("direction"));
  const travelDate = String(formData.get("date"));
  const preferredTime = String(formData.get("time"));
  const flexibility = parseFlexibility(formData);
  const pickup = String(formData.get("pickup") ?? "").trim();
  const dropoff = String(formData.get("dropoff") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const today = new Date().toISOString().slice(0, 10);

  if ((direction !== "to-berlin" && direction !== "from-berlin") || !travelDate || !preferredTime || !pickup || !dropoff) {
    redirect("/requests/new?error=Complete%20all%20required%20fields.");
  }
  if ("error" in flexibility) redirect(`/requests/new?error=${encodeURIComponent(flexibility.error)}`);
  if (travelDate < today) redirect("/requests/new?error=Travel%20date%20must%20be%20today%20or%20later.");
  if (pickup.length > 100 || dropoff.length > 100 || notes.length > 1000) {
    redirect("/requests/new?error=One%20or%20more%20fields%20are%20too%20long.");
  }

  const { error } = await supabase.from("transport_requests").insert({
    passenger_id: user.id,
    direction,
    travel_date: travelDate,
    preferred_time: preferredTime,
    flexibility_type: flexibility.flexibilityType,
    date_flexibility: flexibility.dateFlexibility,
    time_flexibility: flexibility.timeFlexibility,
    pickup,
    dropoff,
    notes,
  });
  if (error) redirect(`/requests/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect("/?message=Request%20published.#transport-requests-heading");
}

export async function deleteTransportRequest(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await requireUser("/dashboard");
  const { error } = await supabase.from("transport_requests").delete().eq("id", id).eq("passenger_id", user.id);
  if (error) redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard?message=Transport%20request%20deleted.");
}

export async function updateTransportRequest(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await requireUser(`/requests/${id}/edit`);
  const direction = String(formData.get("direction"));
  const travelDate = String(formData.get("date") ?? "");
  const preferredTime = String(formData.get("time") ?? "");
  const flexibility = parseFlexibility(formData);
  const pickup = String(formData.get("pickup") ?? "").trim();
  const dropoff = String(formData.get("dropoff") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const today = new Date().toISOString().slice(0, 10);

  if ((direction !== "to-berlin" && direction !== "from-berlin") || !travelDate || !preferredTime || !pickup || !dropoff) {
    redirect(`/requests/${id}/edit?error=${encodeURIComponent("Complete all required fields.")}`);
  }
  if ("error" in flexibility) redirect(`/requests/${id}/edit?error=${encodeURIComponent(flexibility.error)}`);
  if (travelDate < today) redirect(`/requests/${id}/edit?error=${encodeURIComponent("Travel date must be today or later.")}`);
  if (pickup.length > 100 || dropoff.length > 100 || notes.length > 1000) {
    redirect(`/requests/${id}/edit?error=${encodeURIComponent("One or more fields are too long.")}`);
  }

  const { error } = await supabase.from("transport_requests").update({ direction, travel_date: travelDate, preferred_time: preferredTime, flexibility_type: flexibility.flexibilityType, date_flexibility: flexibility.dateFlexibility, time_flexibility: flexibility.timeFlexibility, pickup, dropoff, notes }).eq("id", id).eq("passenger_id", user.id);
  if (error) redirect(`/requests/${id}/edit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/requests/${id}`);
  redirect("/dashboard?message=Request%20updated.");
}
