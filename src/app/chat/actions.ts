"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { sendEmailNotification } from "@/lib/email-notifications";

export async function startConversation(formData: FormData) {
  const tripId = String(formData.get("tripId") ?? "");
  const { supabase, user } = await requireUser(`/trips/${tripId}`);
  const { data: existing } = await supabase.from("conversations").select("id").eq("trip_id", tripId).eq("passenger_id", user.id).maybeSingle();
  const { data, error } = await supabase.rpc("start_conversation", {
    target_trip_id: tripId,
  });
  if (error) redirect(`/trips/${tripId}?error=${encodeURIComponent(error.message)}`);
  if (!existing) {
    const { data: trip } = await supabase.from("trips").select("driver_id").eq("id", tripId).single();
    if (trip) await sendEmailNotification(trip.driver_id, "New ride request", "Someone is interested in your trip offer and opened a private conversation.", `/chat/${data}`);
  }
  redirect(`/chat/${data}`);
}

export async function startRequestConversation(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const { supabase, user } = await requireUser(`/requests/${requestId}`);
  const { data: existing } = await supabase.from("conversations").select("id").eq("transport_request_id", requestId).eq("passenger_id", user.id).maybeSingle();
  const { data, error } = await supabase.rpc("start_request_conversation", { target_request_id: requestId });
  if (error) redirect(`/requests/${requestId}?error=${encodeURIComponent(error.message)}`);
  if (!existing) {
    const { data: request } = await supabase.from("transport_requests").select("passenger_id").eq("id", requestId).single();
    if (request) await sendEmailNotification(request.passenger_id, "New message about your transport request", "A driver has opened a private conversation about your transport request.", `/chat/${data}`);
  }
  redirect(`/chat/${data}`);
}

export async function sendMessage(conversationId: string, body: string) {
  const { supabase, user } = await requireUser(`/chat/${conversationId}`);
  const text = body.trim();
  if (!text || text.length > 2000) return { error: "Enter a message containing no more than 2,000 characters." };
  const { data, error } = await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: user.id, body: text }).select("id, conversation_id, sender_id, body, created_at").single();
  if (error) return { error: error.message };
  const { data: members } = await supabase.from("conversation_members").select("user_id").eq("conversation_id", conversationId);
  const recipient = members?.find((member) => member.user_id !== user.id);
  if (recipient) await sendEmailNotification(recipient.user_id, "New chat message", "You received a new private message on Berlin Zagreb Transport.", `/chat/${conversationId}`);
  return { data };
}
