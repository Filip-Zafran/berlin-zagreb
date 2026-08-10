"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const categories = [
  { value: "registration-login", label: "Registration or login" },
  { value: "trips-requests", label: "Trips or transport requests" },
  { value: "messages", label: "Messages" },
  { value: "profile-account", label: "Profile or account" },
  { value: "other", label: "Something else" },
] as const;

const fieldClass = "focus-ring mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm placeholder:text-slate-400";
const maxScreenshotSize = 5 * 1024 * 1024;

export function TechnicalSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  async function openForm() {
    setError("");
    setSuccess(false);
    setIsOpen(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setContactEmail(user.email);
    } catch {
      // Anonymous visitors can enter their contact email in the form.
    }
  }

  async function submitTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const screenshot = formData.get("screenshot");
    if (!(screenshot instanceof File) || screenshot.size === 0) {
      setError("Please attach a screenshot of the issue.");
      setIsSubmitting(false);
      return;
    }
    if (screenshot.size > maxScreenshotSize) {
      setError("The screenshot must be smaller than 5 MB.");
      setIsSubmitting(false);
      return;
    }

    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    const extension = extensions[screenshot.type];
    if (!extension) {
      setError("Please upload a JPG, PNG, or WebP screenshot.");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const ticketId = crypto.randomUUID();
      const ownerFolder = user?.id ?? "anonymous";
      const screenshotPath = `${ownerFolder}/${ticketId}/screenshot.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("technical-ticket-screenshots")
        .upload(screenshotPath, screenshot, { contentType: screenshot.type, upsert: false });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("technical_support_tickets").insert({
        id: ticketId,
        reporter_id: user?.id ?? null,
        contact_email: String(formData.get("contactEmail") ?? "").trim(),
        category: String(formData.get("category") ?? ""),
        description: String(formData.get("description") ?? "").trim(),
        screenshot_path: screenshotPath,
        page_url: window.location.href,
      });
      if (insertError) throw insertError;

      formRef.current?.reset();
      setSuccess(true);
    } catch (submissionError) {
      console.error("Technical ticket submission failed", submissionError);
      setError("We could not submit the ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openForm}
        className="focus-ring fixed bottom-5 right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:bottom-6 sm:right-6"
        aria-label="Raise a technical support ticket"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path d="M12 8.25v4.5m0 3.25v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
        Technical issue?
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="technical-ticket-title" className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-stone-50 p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="eyebrow">Technical support</p>
                <h2 id="technical-ticket-title" className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Raise a ticket</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Tell us what went wrong so we can investigate it.</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="focus-ring grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-xl text-slate-500 hover:text-slate-950" aria-label="Close technical support form">×</button>
            </div>

            {success ? (
              <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900" role="status">
                <p className="font-bold">Ticket submitted</p>
                <p className="mt-1 text-sm leading-6">Thank you. We have received your report and screenshot.</p>
                <button type="button" onClick={() => setIsOpen(false)} className="focus-ring mt-4 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-bold text-white">Close</button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={submitTicket} className="mt-7 space-y-5">
                {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                <label className="block text-sm font-bold text-slate-700">
                  What is the issue about?
                  <select name="category" required defaultValue="" className={fieldClass}>
                    <option value="" disabled>Choose a category</option>
                    {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                  </select>
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Contact email
                  <input name="contactEmail" type="email" autoComplete="email" required value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className={fieldClass} placeholder="you@example.com" />
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Describe the issue
                  <textarea name="description" required minLength={10} maxLength={2000} rows={5} className={`${fieldClass} resize-y py-3`} placeholder="What were you trying to do, and what happened instead?" />
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Screenshot <span className="text-red-600">*</span>
                  <input name="screenshot" type="file" accept="image/jpeg,image/png,image/webp" required className="focus-ring mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-bold file:text-slate-800" />
                  <span className="mt-2 block text-xs font-normal text-slate-500">Required · JPG, PNG, or WebP · maximum 5 MB</span>
                </label>

                <button type="submit" disabled={isSubmitting} className="focus-ring min-h-12 w-full rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
                  {isSubmitting ? "Submitting…" : "Submit ticket"}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
