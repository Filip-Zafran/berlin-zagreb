import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg" aria-label="Via home">
      <span className="relative grid size-9 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path d="M7 5.5h4.1a3 3 0 0 1 3 3v7a3 3 0 0 0 3 3H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="7" cy="5.5" r="2" fill="#60a5fa" />
          <circle cx="19" cy="18.5" r="2" fill="#fb923c" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-[-0.04em] text-slate-950">via</span>
    </Link>
  );
}
