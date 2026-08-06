import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatRoom, type ChatMessage } from "@/components/chat-room";
import { Header } from "@/components/header";
import { ProfileAvatar } from "@/components/profile-avatar";
import { requireUser } from "@/lib/auth";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const { supabase, user } = await requireUser(`/chat/${id}`);
  const { data: conversation } = await supabase.from("conversations").select("id, trip_id, passenger_id, trips(driver_id, direction, departure_at)").eq("id", id).single();
  if (!conversation) notFound();
  const trip = conversation.trips as unknown as { driver_id: string; direction: string; departure_at: string };
  const otherId = user.id === trip.driver_id ? conversation.passenger_id : trip.driver_id;
  const [{ data: other }, { data: members }, { data: messages }] = await Promise.all([
    supabase.from("profiles").select("first_name, avatar_path").eq("id", otherId).single(),
    supabase.from("conversation_members").select("user_id, last_read_at").eq("conversation_id", id),
    supabase.from("messages").select("id, conversation_id, sender_id, body, created_at").eq("conversation_id", id).order("created_at"),
  ]);
  const otherName = other?.first_name ?? "Traveller"; const otherRead = members?.find((member) => member.user_id === otherId)?.last_read_at ?? null;
  const avatarUrl = other?.avatar_path ? supabase.storage.from("avatars").getPublicUrl(other.avatar_path).data.publicUrl : null;
  return <div className="min-h-screen bg-stone-50"><Header /><main className="mx-auto max-w-4xl px-4 py-7 sm:px-6 lg:px-8">
    <div className="mb-5 flex items-center gap-4"><Link href="/dashboard" className="focus-ring rounded-lg text-sm font-bold text-slate-500 hover:text-slate-950">← Chats</Link><div className="h-6 w-px bg-slate-200" /><ProfileAvatar name={otherName} avatarUrl={avatarUrl} size="small" /><div><h1 className="font-bold text-slate-950">{otherName}</h1><p className="text-xs text-slate-500">{trip.direction === "berlin-zagreb" ? "Berlin → Zagreb" : "Zagreb → Berlin"} · {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(trip.departure_at))}</p></div></div>
    <ChatRoom conversationId={id} userId={user.id} otherName={otherName} initialMessages={(messages ?? []) as ChatMessage[]} otherLastReadAt={otherRead} />
  </main></div>;
}
