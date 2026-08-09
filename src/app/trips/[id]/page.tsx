import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { DriverAvatar } from "@/components/trip-card";
import { getPublishedTrip } from "@/lib/trips";
import { startConversation } from "@/app/chat/actions";
import { FlexibilityBadge } from "@/components/flexibility-badge";

type TripPageProps = { params: Promise<{ id: string }>; searchParams?: Promise<{ error?: string }> };

const dateFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const timeFormatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
  const trip = await getPublishedTrip((await params).id);
  return trip ? { title: `${trip.startCity} to ${trip.destinationCity} with ${trip.driver.name} — Berlin <> Zagreb prijevoz` } : {};
}

export default async function TripPage({ params, searchParams }: TripPageProps) {
  const tripId = (await params).id;
  const trip = await getPublishedTrip(tripId);
  if (!trip) notFound();

  const departure = new Date(trip.departure);
  const isBlue = trip.direction === "berlin-zagreb";
  const stops = trip.direction === "zagreb-berlin"
    ? [trip.zagrebSideEndpoint, trip.startCity, ...trip.stops, trip.destinationCity].filter((stop): stop is string => Boolean(stop))
    : [trip.startCity, ...trip.stops, trip.destinationCity, trip.zagrebSideEndpoint].filter((stop): stop is string => Boolean(stop));
  const error = (await searchParams)?.error;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-7 sm:px-6 lg:px-8 lg:pt-10">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-950">
          <span aria-hidden="true">←</span> All trips
        </Link>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
          <section className={`overflow-hidden rounded-3xl border bg-white shadow-[0_18px_50px_-35px_rgba(15,23,42,0.4)] ${isBlue ? "border-blue-200" : "border-orange-200"}`}>
            <div className="border-b border-slate-100 p-5 sm:p-8">
              <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${isBlue ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>{trip.startCity} → {trip.destinationCity}</span>
              {trip.petFriendly && <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><span aria-hidden="true">🐾</span>Pet Friendly</span>}
              <span className="ml-2 inline-flex"><FlexibilityBadge schedule={trip} /></span>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">{dateFormatter.format(departure)}</h1>
              <p className="mt-2 text-lg font-semibold text-slate-500">Departure at {timeFormatter.format(departure)}</p>
            </div>

            <div className="p-5 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">Route</h2>
              <ol className="mt-5 space-y-0">
                {stops.map((stop, index) => (
                  <li key={`${stop}-${index}`} className="grid grid-cols-[20px_1fr] gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1.5 size-3 rounded-full ${index === 0 || index === stops.length - 1 ? (isBlue ? "bg-blue-500" : "bg-orange-500") : "border-2 border-slate-300 bg-white"}`} />
                      {index < stops.length - 1 && <span className="min-h-8 w-px flex-1 bg-slate-200" />}
                    </div>
                    <div className="pb-5">
                      <p className="font-semibold text-slate-800">{stop}</p>
                      {index === 0 && <p className="mt-1 text-sm text-slate-500">Pickup: {trip.pickup}</p>}
                      {index === stops.length - 1 && <p className="mt-1 text-sm text-slate-500">Drop-off: {trip.dropoff}</p>}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-3 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Car</p>
                  <p className="mt-2 font-semibold text-slate-800">{trip.car}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Price</p>
                  <p className="mt-2 font-semibold text-slate-800">{trip.price || "By agreement"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Additional notes</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{trip.notes}</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.4)] sm:p-6">
            {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="flex items-center gap-4">
              <DriverAvatar trip={trip} size="large" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Your driver</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">{trip.driver.name}</h2>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{trip.driver.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {trip.driver.languages.map((language) => <span key={language} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{language}</span>)}
            </div>
            <form action={startConversation} className="mt-6"><input type="hidden" name="tripId" value={tripId} /><button className="focus-ring flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800">Message driver</button></form>
            <p className="mt-3 text-center text-xs leading-5 text-slate-400">Log in to start or continue a private conversation.</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
