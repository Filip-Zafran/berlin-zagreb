import { requestPasswordReset } from "@/app/auth/actions";
import { AuthNotice, AuthShell, inputClass, submitClass } from "@/components/auth-shell";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const query = await searchParams;
  return (
    <AuthShell eyebrow="Password reset" title="Find your way back" description="Enter your email and we’ll send you a secure reset link.">
      <AuthNotice error={query.error} message={query.message} />
      <form action={requestPasswordReset} className="space-y-5">
        <label className="block text-sm font-bold text-slate-700">Email<input className={inputClass} name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <button className={submitClass} type="submit">Send reset link</button>
      </form>
    </AuthShell>
  );
}
