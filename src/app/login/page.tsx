import Link from "next/link";
import { login } from "@/app/auth/actions";
import { AuthNotice, AuthShell, inputClass, submitClass } from "@/components/auth-shell";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string; next?: string }> }) {
  const query = await searchParams;
  return (
    <AuthShell eyebrow="Welcome back" title="Log in to Via" description="Continue to your trips and private conversations." footer={<>New here? <Link className="font-bold text-slate-950 hover:underline" href="/register">Create an account</Link></>}>
      <AuthNotice error={query.error} message={query.message} />
      <form action={login} className="space-y-5">
        <input type="hidden" name="next" value={query.next ?? "/dashboard"} />
        <label className="block text-sm font-bold text-slate-700">Email<input className={inputClass} name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <label className="block text-sm font-bold text-slate-700">Password<input className={inputClass} name="password" type="password" autoComplete="current-password" required /></label>
        <div className="text-right"><Link href="/forgot-password" className="text-sm font-bold text-slate-500 hover:text-slate-950">Forgot password?</Link></div>
        <button className={submitClass} type="submit">Log in</button>
      </form>
    </AuthShell>
  );
}
