import type { Trip } from "@/data/trips";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function TripCard({ trip, tone }: { trip: Trip; tone: "blue" | "orange" }) {
  const departure = new Date(trip.departure);
  const arrival = new Date(trip.arrival);
  const accent = tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-25px_rgba(15,23,42,0.5)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_36px_-24px_rgba(15,23,42,0.45)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-950">{dateFormatter.format(departure)}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">Estimated arrival {timeFormatter.format(arrival)}</p>
        </div>
        <p className="text-right text-xl font-bold tracking-[-0.03em] text-slate-950">€{trip.price}<span className="block text-xs font-medium tracking-normal text-slate-400">per seat</span></p>
      </div>

      <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-4">
        <div className="flex w-12 flex-col items-center">
          <span className="text-lg font-bold text-slate-950">{timeFormatter.format(departure)}</span>
          <span className={`mt-2 size-2.5 rounded-full ${tone === "blue" ? "bg-blue-500" : "bg-orange-500"}`} />
          <span className="mt-1 h-7 w-px bg-slate-200" />
          <span className="size-2.5 rounded-full border-2 border-slate-300 bg-white" />
        </div>
        <div className="pt-8">
          <p className="text-sm font-semibold text-slate-800">{trip.pickup}</p>
          <p className="mt-8 text-sm font-semibold text-slate-800">{trip.dropoff}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${accent}`}>{trip.driver.initials}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{trip.driver.name}</p>
            <p className="text-xs text-slate-500"><span className="text-amber-500">★</span> {trip.driver.rating.toFixed(1)} · {trip.driver.rides} rides</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">{trip.seats} {trip.seats === 1 ? "seat" : "seats"}</span>
      </div>
    </article>
  );
}
