"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function startConversation(formData: FormData) {
  const tripId = String(formData.get("tripId") ?? "");
  const { supabase } = await requireUser(`/trips/${tripId}`);
  const { data, error } = await supabase.rpc("start_conversation", {
    target_trip_id: tripId,
  });
  if (error) redirect(`/trips/${tripId}?error=${encodeURIComponent(error.message)}`);
  redirect(`/chat/${data}`);
}
