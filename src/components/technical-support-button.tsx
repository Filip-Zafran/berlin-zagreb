"use client";

const supportEmail = "filip.zafran@gmail.com";
const mailtoLink = `mailto:${supportEmail}?subject=Berlin%20Zagreb%20Transport%20support`;

export function TechnicalSupportButton() {
  return (
    <a
      href={mailtoLink}
      className="focus-ring fixed bottom-5 right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:bottom-6 sm:right-6"
      aria-label="Email technical support"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path d="M12 8.25v4.5m0 3.25v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
      Technical issue?
    </a>
  );
}
