import Link from "next/link";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto grid max-w-2xl place-items-center px-4 py-24 text-center">
        <div>
          <p className="eyebrow">Trip not found</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">This ride is no longer here.</h1>
          <p className="mt-4 leading-7 text-slate-500">It may have been removed or the link may be incorrect.</p>
          <Link href="/" className="focus-ring mt-7 inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">Browse upcoming trips</Link>
        </div>
      </main>
    </div>
  );
}
