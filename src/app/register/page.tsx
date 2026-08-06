import Link from "next/link";
import { register } from "@/app/auth/actions";
import { AuthNotice, AuthShell, inputClass, submitClass } from "@/components/auth-shell";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  return (
    <AuthShell eyebrow="Join Berlin <> Zagreb prijevoz" title="Create your account" description="You only need a name, email, and password to get started." footer={<>Already registered? <Link className="font-bold text-slate-950 hover:underline" href="/login">Log in</Link></>}>
      <AuthNotice error={query.error} />
      <form action={register} className="space-y-5">
        <label className="block text-sm font-bold text-slate-700">First name<input className={inputClass} name="firstName" autoComplete="given-name" required placeholder="Marta" /></label>
        <label className="block text-sm font-bold text-slate-700">Email<input className={inputClass} name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <label className="block text-sm font-bold text-slate-700">Password<input className={inputClass} name="password" type="password" autoComplete="new-password" minLength={8} required /><span className="mt-2 block text-xs font-normal text-slate-400">At least 8 characters</span></label>
        <button className={submitClass} type="submit">Create account</button>
      </form>
    </AuthShell>
  );
}
