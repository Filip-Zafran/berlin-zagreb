"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function RegistrationCountdown({ initialSeconds }: { initialSeconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const router = useRouter();

  useEffect(() => {
    if (seconds <= 0) {
      router.refresh();
      return;
    }
    const timer = window.setTimeout(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [router, seconds]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const countdown = [hours, minutes, remainingSeconds].map((part) => String(part).padStart(2, "0")).join(":");

  return (
    <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-amber-950">
      <p className="font-bold">Registration is temporarily paused</p>
      <p className="mt-2 text-sm leading-6">This is a free project, so there is a limit on how many people can register in a short period of time.</p>
      <p className="mt-5 text-sm font-semibold">Please wait before creating your account:</p>
      <p className="mt-2 font-mono text-3xl font-bold tabular-nums" aria-label={`${seconds} seconds remaining`}>{countdown}</p>
      <p className="mt-2 text-xs text-amber-700">The registration form will return automatically.</p>
    </div>
  );
}
