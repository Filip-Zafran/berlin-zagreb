import { TripCard } from "@/components/trip-card";
import type { Trip } from "@/data/trips";

type RouteColumnProps = {
  direction: string;
  description: string;
  tone: "blue" | "orange";
  trips: Trip[];
};

const styles = {
  blue: {
    shell: "border-blue-200/80",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    line: "from-blue-200",
  },
  orange: {
    shell: "border-orange-200/80",
    badge: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
    line: "from-orange-200",
  },
};

export function RouteColumn({ direction, description, tone, trips }: RouteColumnProps) {
  const theme = styles[tone];

  return (
    <article className={`overflow-hidden rounded-3xl border bg-white shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)] ${theme.shell}`}>
      <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className={`size-2.5 rounded-full ${theme.dot}`} />
            <h2 className="text-lg font-bold tracking-[-0.02em] text-slate-950 sm:text-xl">{direction}</h2>
          </div>
          <p className="mt-1 pl-5 text-sm text-slate-500">{description}</p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${theme.badge}`}>{trips.length} {trips.length === 1 ? "ride" : "rides"}</span>
      </header>

      <div className="space-y-3 p-4 sm:p-5">
        {trips.length ? trips.map((trip) => <TripCard key={trip.id} trip={trip} tone={tone} />) : (
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center">
          <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${theme.line} via-transparent to-transparent`} />
          <div className="mx-auto grid size-11 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path d="M7 3v3m10-3v3M4.5 9.5h15M6.5 5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-800">No rides on this date</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-slate-500">Try another day or clear the date to see all upcoming rides.</p>
        </div>
        )}
      </div>
    </article>
  );
}
