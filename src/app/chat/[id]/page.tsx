import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatRoom, type ChatMessage } from "@/components/chat-room";
import { Header } from "@/components/header";
import { ProfileAvatar } from "@/components/profile-avatar";
import { requireUser } from "@/lib/auth";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const { supabase, user } = await requireUser(`/chat/${id}`);
  const { data: conversation } = await supabase.from("conversations").select("id, trip_id, transport_request_id, trips(direction, departure_at), transport_requests(direction, travel_date)").eq("id", id).single();
  if (!conversation) notFound();
  const { data: members } = await supabase.from("conversation_members").select("user_id, last_read_at").eq("conversation_id", id);
  const otherId = members?.find((member) => member.user_id !== user.id)?.user_id;
  if (!otherId) notFound();
  const [{ data: other }, { data: messages }] = await Promise.all([
    supabase.from("profiles").select("first_name, avatar_path").eq("id", otherId).single(),
    supabase.from("messages").select("id, conversation_id, sender_id, body, created_at").eq("conversation_id", id).order("created_at"),
  ]);
  const otherName = other?.first_name ?? "Traveller"; const otherRead = members?.find((member) => member.user_id === otherId)?.last_read_at ?? null;
  const avatarUrl = other?.avatar_path ? supabase.storage.from("avatars").getPublicUrl(other.avatar_path).data.publicUrl : null;
  const trip = conversation.trips as unknown as { direction: string; departure_at: string } | null;
  const transportRequest = conversation.transport_requests as unknown as { direction: string; travel_date: string } | null;
  const direction = trip ? (trip.direction === "berlin-zagreb" ? "Berlin → Zagreb" : "Zagreb → Berlin") : (transportRequest?.direction === "from-berlin" ? "From Berlin" : "To Berlin");
  const contextDate = trip?.departure_at ?? `${transportRequest?.travel_date}T12:00:00`;
  return <div className="min-h-screen bg-stone-50"><Header /><main className="mx-auto max-w-4xl px-4 py-7 sm:px-6 lg:px-8">
    <div className="mb-5 flex items-center gap-4"><Link href="/dashboard" className="focus-ring rounded-lg text-sm font-bold text-slate-500 hover:text-slate-950">← Chats</Link><div className="h-6 w-px bg-slate-200" /><ProfileAvatar name={otherName} avatarUrl={avatarUrl} size="small" /><div><h1 className="font-bold text-slate-950">{otherName}</h1><p className="text-xs text-slate-500">{direction} · {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(contextDate))}</p></div></div>
    <ChatRoom conversationId={id} userId={user.id} otherName={otherName} initialMessages={(messages ?? []) as ChatMessage[]} otherLastReadAt={otherRead} />
  </main></div>;
}
