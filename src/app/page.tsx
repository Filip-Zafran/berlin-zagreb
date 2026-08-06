import { Header } from "@/components/header";
import { TripBrowser } from "@/components/trip-browser";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section className="mb-9 max-w-3xl">
          <p className="eyebrow">Berlin & Zagreb rides</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            Your next ride is closer than you think.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">
            Find friendly drivers travelling between Berlin and Zagreb, then
            arrange the details directly in a private chat.
          </p>
        </section>

        <TripBrowser />
      </main>
    </div>
  );
}
