import Link from "next/link";
import type { TransportRequest } from "@/lib/transport-requests";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });

function RequestCard({ request, tone }: { request: TransportRequest; tone: "blue" | "orange" }) {
  const accent = tone === "blue" ? "border-blue-200" : "border-orange-200";
  return (
    <article className={`rounded-2xl border bg-white p-4 shadow-[0_10px_30px_-25px_rgba(15,23,42,0.5)] sm:p-5 ${accent}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            role="img"
            aria-label={`${request.passenger.name} profile photo`}
            style={request.passenger.avatarUrl ? { backgroundImage: `url(${request.passenger.avatarUrl})` } : undefined}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 bg-cover bg-center text-xs font-bold text-white shadow-sm ring-2 ring-white"
          >
            {!request.passenger.avatarUrl && request.passenger.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">{request.passenger.name}</p>
            <p className="text-xs text-slate-500">Looking for transport</p>
          </div>
        </div>
        <p className="shrink-0 text-sm font-bold text-slate-950">{dateFormatter.format(new Date(`${request.travelDate}T12:00:00`))}</p>
      </div>
      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Requested route</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{request.pickup} → {request.dropoff}</p>
        {request.notes && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{request.notes}</p>}
      </div>
    </article>
  );
}

function RequestColumn({ title, description, tone, requests }: { title: string; description: string; tone: "blue" | "orange"; requests: TransportRequest[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/60 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><h3 className="text-lg font-bold text-slate-950">{title}</h3><p className="mt-0.5 text-sm text-slate-500">{description}</p></div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"}`}>{requests.length}</span>
      </div>
      {requests.length ? <div className="space-y-3">{requests.map((request) => <RequestCard key={request.id} request={request} tone={tone} />)}</div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-9 text-center"><p className="font-semibold text-slate-700">No requests yet</p><p className="mt-1 text-sm text-slate-500">Be the first traveler to post one.</p></div>}
    </div>
  );
}

export function TransportRequestBrowser({ requests }: { requests: TransportRequest[] }) {
  return (
    <section aria-labelledby="transport-requests-heading" className="mt-20 border-t-4 border-slate-200 pt-12">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow">Passenger requests</p><h2 id="transport-requests-heading" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Looking for transport</h2><p className="mt-2 text-slate-500">Travelers who need a ride between Berlin and Zagreb.</p></div>
        <Link href="/requests/new" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">Post a request</Link>
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <RequestColumn title="To Berlin" description="Travelers heading toward Berlin" tone="blue" requests={requests.filter((request) => request.direction === "to-berlin")} />
        <RequestColumn title="From Berlin" description="Travelers leaving Berlin" tone="orange" requests={requests.filter((request) => request.direction === "from-berlin")} />
      </div>
    </section>
  );
}
