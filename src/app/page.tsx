import { Header } from "@/components/header";
import { TripBrowser } from "@/components/trip-browser";
import { getUpcomingTrips } from "@/lib/trips";

export default async function Home() {
  const trips = await getUpcomingTrips();
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section className="mb-9 max-w-3xl">
          <p className="eyebrow">Zagreb ↔ Berlin i sve između</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            Lakše do prijevoza. Zajedno, cijelim putem.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">
            Povezujemo ljude koji nude i traže prijevoz osoba, stvari i kućnih
            ljubimaca na relaciji Zagreb – Berlin i na svim usputnim stanicama.
          </p>
        </section>

        <TripBrowser trips={trips} />
      </main>
    </div>
  );
}
