import Link from "next/link";
import type { Trip } from "@/data/trips";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
const timeFormatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

export function DriverAvatar({ trip, size = "small" }: { trip: Trip; size?: "small" | "large" }) {
  return (
    <span role="img" aria-label={`${trip.driver.name} profile photo`} style={trip.driver.avatarUrl ? { backgroundImage: `url(${trip.driver.avatarUrl})` } : undefined} className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br bg-cover bg-center font-bold text-white shadow-sm ring-2 ring-white ${trip.driver.photo} ${size === "large" ? "size-20 text-xl" : "size-10 text-xs"}`}>
      {!trip.driver.avatarUrl && trip.driver.initials}
    </span>
  );
}

export function TripCard({ trip, tone }: { trip: Trip; tone: "blue" | "orange" }) {
  const departure = new Date(trip.departure);
  const accent = tone === "blue" ? "border-blue-200 hover:border-blue-300" : "border-orange-200 hover:border-orange-300";
  const route = [trip.startCity, ...trip.stops, trip.destinationCity];

  return (
    <article className={`rounded-2xl border bg-white p-4 shadow-[0_10px_30px_-25px_rgba(15,23,42,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-24px_rgba(15,23,42,0.45)] sm:p-5 ${accent}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <DriverAvatar trip={trip} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">{trip.driver.name}</p>
            <p className="truncate text-xs text-slate-500">{trip.car}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-slate-950">{dateFormatter.format(departure)}</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">{timeFormatter.format(departure)}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Route</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{route.join(" → ")}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{trip.notes}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="min-w-0 truncate text-xs font-medium text-slate-500">{trip.pickup} → {trip.dropoff}</p>
        <Link href={`/trips/${trip.id}`} className="focus-ring shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
          Open trip
        </Link>
      </div>
    </article>
  );
}
