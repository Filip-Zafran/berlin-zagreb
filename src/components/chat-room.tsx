"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type ChatMessage = { id: string; conversation_id: string; sender_id: string; body: string; created_at: string };

export function ChatRoom({ conversationId, userId, otherName, initialMessages, otherLastReadAt }: { conversationId: string; userId: string; otherName: string; initialMessages: ChatMessage[]; otherLastReadAt: string | null }) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [readAt, setReadAt] = useState(otherLastReadAt);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const markRead = () => supabase.from("conversation_members").update({ last_read_at: new Date().toISOString() }).eq("conversation_id", conversationId).eq("user_id", userId).then();
    void markRead();
    const channel = supabase.channel(`chat:${conversationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        const message = payload.new as ChatMessage;
        setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
        if (message.sender_id !== userId) { setNotice(`New message from ${otherName}`); void markRead(); }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversation_members", filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        const member = payload.new as { user_id: string; last_read_at: string | null }; if (member.user_id !== userId) setReadAt(member.last_read_at);
      }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [conversationId, otherName, userId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(event: React.FormEvent) {
    event.preventDefault(); const text = body.trim(); if (!text || sending) return; setSending(true); setNotice("");
    const supabase = createClient();
    const { data, error } = await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: userId, body: text }).select("id, conversation_id, sender_id, body, created_at").single();
    if (!error && data) { setMessages((current) => current.some((item) => item.id === data.id) ? current : [...current, data]); setBody(""); }
    else setNotice(error?.message ?? "Message could not be sent."); setSending(false);
  }

  return <div className="flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    {notice && <button type="button" onClick={() => setNotice("")} className="bg-blue-50 px-4 py-3 text-left text-sm font-semibold text-blue-700">{notice} <span className="float-right">×</span></button>}
    <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">{messages.length ? messages.map((message) => { const own = message.sender_id === userId; const wasRead = own && readAt && new Date(readAt) >= new Date(message.created_at); return <div key={message.id} className={`flex ${own ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 ${own ? "rounded-br-md bg-slate-950 text-white" : "rounded-bl-md bg-slate-100 text-slate-800"}`}><p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p><p className={`mt-1 text-[11px] ${own ? "text-slate-400" : "text-slate-500"}`}>{new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(message.created_at))}{wasRead ? " · Read" : ""}</p></div></div>; }) : <div className="grid h-full place-items-center text-center"><div><p className="font-semibold text-slate-700">Start the conversation</p><p className="mt-1 text-sm text-slate-500">Ask about pickup, luggage, or timing.</p></div></div>}<div ref={endRef} /></div>
    <form onSubmit={send} className="flex gap-2 border-t border-slate-100 p-3 sm:p-4"><label className="sr-only" htmlFor="message">Message</label><textarea id="message" value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} maxLength={2000} rows={1} placeholder={`Message ${otherName}`} className="focus-ring min-h-12 flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm" /><button disabled={!body.trim() || sending} className="focus-ring rounded-xl bg-slate-950 px-5 text-sm font-bold text-white disabled:opacity-40">Send</button></form>
  </div>;
}
