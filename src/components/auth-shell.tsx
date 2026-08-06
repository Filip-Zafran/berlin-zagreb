import Link from "next/link";
import { Logo } from "@/components/logo";

export function AuthShell({ eyebrow, title, description, children, footer }: { eyebrow: string; title: string; description: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-stone-50 lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.72fr)]">
      <section className="hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <LogoOnDark />
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-300">Berlin ↔ Zagreb</p>
          <p className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.05em]">Good company makes a long journey feel shorter.</p>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">Find a ride, meet your driver, and arrange everything privately.</p>
        </div>
        <p className="text-sm text-slate-500">Simple rides. Direct conversations.</p>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><Logo /></div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">{title}</h1>
          <p className="mt-3 leading-7 text-slate-500">{description}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-7 text-sm text-slate-500">{footer}</div>}
          <Link href="/" className="focus-ring mt-10 inline-flex rounded-lg text-sm font-bold text-slate-500 hover:text-slate-950">← Back to trips</Link>
        </div>
      </section>
    </main>
  );
}

function LogoOnDark() {
  return <Link href="/" className="focus-ring inline-flex w-fit items-center gap-2 rounded-lg"><span className="grid size-9 place-items-center rounded-xl bg-white text-lg font-black text-slate-950">v</span><span className="text-xl font-bold tracking-[-0.04em]">via</span></Link>;
}

export function AuthNotice({ error, message }: { error?: string; message?: string }) {
  if (!error && !message) return null;
  return <div role={error ? "alert" : "status"} className={`mb-5 rounded-xl border px-4 py-3 text-sm leading-6 ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error ?? message}</div>;
}

export const inputClass = "focus-ring mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-950 shadow-sm placeholder:text-slate-400";
export const submitClass = "focus-ring mt-2 min-h-12 w-full rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800";
