import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { FlexibilityBadge } from "@/components/flexibility-badge";
import { startRequestConversation } from "@/app/chat/actions";
import { getPublishedTransportRequest } from "@/lib/transport-requests";
import { createClient } from "@/lib/supabase/server";

export default async function TransportRequestPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params; const request = await getPublishedTransportRequest(id); const { error } = await searchParams;
  if (!request) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = Boolean(user?.id && (request as any).passengerId && user.id === (request as any).passengerId);
  return <div className="min-h-screen bg-stone-50"><Header /><main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <Link href="/#transport-requests-heading" className="focus-ring text-sm font-bold text-slate-500 hover:text-slate-950">← Transport requests</Link>
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="eyebrow">Looking for transport</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{request.pickup} → {request.dropoff}</h1>
      <p className="mt-3 text-slate-500">{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${request.travelDate}T12:00:00`))} · {request.preferredTime}</p>
      <div className="mt-4"><FlexibilityBadge schedule={request} /></div>
      {request.notes && <p className="mt-6 border-t border-slate-100 pt-6 leading-7 text-slate-600">{request.notes}</p>}
      <div className="mt-8 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">{request.passenger.initials}</span><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Traveler</p><p className="font-bold text-slate-900">{request.passenger.name}</p></div></div>
      {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {isOwner && <div className="mt-4"><Link href={`/requests/${id}/edit`} className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Edit request</Link></div>}
      <form action={startRequestConversation} className="mt-6"><input type="hidden" name="requestId" value={id} /><button className="focus-ring min-h-12 w-full rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">Message traveler</button></form>
      <p className="mt-3 text-center text-xs text-slate-400">You need an account to contact this traveler.</p>
    </section>
  </main></div>;
}
