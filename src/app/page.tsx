import { Header } from "@/components/header";
import { TripBrowser } from "@/components/trip-browser";
import { TransportRequestBrowser } from "@/components/transport-request-browser";
import { getUpcomingTrips } from "@/lib/trips";
import { getUpcomingTransportRequests } from "@/lib/transport-requests";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import brandLogo from "@/images/zagreb berlin logo with text.png";
import { matchDistance } from "@/lib/travel-flexibility";

export default async function Home() {
  const [trips, requests] = await Promise.all([getUpcomingTrips(), getUpcomingTransportRequests()]);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id;
  const closestRequest = (trip: (typeof trips)[number]) => {
    const direction = trip.direction === "berlin-zagreb" ? "from-berlin" : "to-berlin";
    const distances = requests.filter((request) => request.direction === direction).map((request) => matchDistance(trip, request)).filter((distance): distance is number => distance !== null);
    return distances.length ? Math.min(...distances) : Number.POSITIVE_INFINITY;
  };
  const closestTrip = (request: (typeof requests)[number]) => {
    const direction = request.direction === "from-berlin" ? "berlin-zagreb" : "zagreb-berlin";
    const distances = trips.filter((trip) => trip.direction === direction).map((trip) => matchDistance(request, trip)).filter((distance): distance is number => distance !== null);
    return distances.length ? Math.min(...distances) : Number.POSITIVE_INFINITY;
  };
  const rankedTrips = [...trips].sort((a, b) => closestRequest(a) - closestRequest(b) || new Date(a.departure).getTime() - new Date(b.departure).getTime());
  const rankedRequests = [...requests].sort((a, b) => closestTrip(a) - closestTrip(b) || new Date(a.departure).getTime() - new Date(b.departure).getTime());
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section className="mb-10">
          <div className="flex justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 py-7 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)] sm:px-10 sm:py-10">
            <Image
              src={brandLogo}
              alt="Zagreb Berlin prijevoz"
              priority
              className="h-auto w-full max-w-4xl object-contain"
            />
          </div>
        </section>

        <TripBrowser trips={rankedTrips} currentUserId={currentUserId} />
        <TransportRequestBrowser requests={rankedRequests} currentUserId={currentUserId} />
      </main>
    </div>
  );
}
