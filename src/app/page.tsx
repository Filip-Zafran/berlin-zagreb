import { Header } from "@/components/header";
import { TripBrowser } from "@/components/trip-browser";
import { getUpcomingTrips } from "@/lib/trips";
import Image from "next/image";
import brandLogo from "@/images/zagreb berlin logo with text.png";

export default async function Home() {
  const trips = await getUpcomingTrips();
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

        <TripBrowser trips={trips} />
      </main>
    </div>
  );
}
