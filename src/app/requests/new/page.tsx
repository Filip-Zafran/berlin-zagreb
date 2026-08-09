import { createTransportRequest } from "@/app/requests/actions";
import { Header } from "@/components/header";
import { TransportRequestForm } from "@/components/transport-request-form";
import { requireUser } from "@/lib/auth";

export default async function NewTransportRequestPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireUser("/requests/new");
  const { error } = await searchParams;
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="eyebrow">Passenger tools</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">Look for transport</h1>
        <p className="mt-3 text-slate-500">Tell drivers where and when you need a ride.</p>
        {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <TransportRequestForm action={createTransportRequest} />
      </main>
    </div>
  );
}
