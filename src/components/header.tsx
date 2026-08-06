import { Logo } from "@/components/logo";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  let user: { email?: string } | null = null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-stone-50/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="focus-ring hidden min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-950 sm:inline-flex">Dashboard</Link>
              <form action={logout}><button className="focus-ring hidden min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-950 sm:inline-flex" type="submit">Log out</button></form>
            </>
          ) : (
            <>
              <Link href="/login" className="focus-ring hidden min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-950 sm:inline-flex">Log in</Link>
              <Link href="/register" className="focus-ring hidden min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-950 sm:inline-flex">Register</Link>
            </>
          )}
          <Link href="/trips/new" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
            <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="hidden xs:inline">Offer a trip</span>
            <span className="xs:hidden">Offer</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
