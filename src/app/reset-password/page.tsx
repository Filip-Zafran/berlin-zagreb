import { updatePassword } from "@/app/auth/actions";
import { AuthNotice, AuthShell, inputClass, submitClass } from "@/components/auth-shell";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  return (
    <AuthShell eyebrow="New password" title="Choose a new password" description="Use at least eight characters and keep it somewhere safe.">
      <AuthNotice error={query.error} />
      <form action={updatePassword} className="space-y-5">
        <label className="block text-sm font-bold text-slate-700">New password<input className={inputClass} name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
        <button className={submitClass} type="submit">Update password</button>
      </form>
    </AuthShell>
  );
}
