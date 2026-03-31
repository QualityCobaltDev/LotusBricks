"use client";

import { useState } from "react";

type LeadFormProps = {
  listingSlug: string;
  listingTitle: string;
};

export function LeadForm({ listingSlug, listingTitle }: LeadFormProps) {
  const [state, setState] = useState<{ loading: boolean; message?: string; error?: string }>({ loading: false });

  async function onSubmit(formData: FormData) {
    setState({ loading: true });
    const payload = {
      listingSlug,
      listingTitle,
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
      sourcePage: window.location.pathname
    };

    const res = await fetch("/api/leads/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    if (!res.ok) {
      setState({ loading: false, error: json.error || "Submission failed" });
      return;
    }
    setState({ loading: false, message: json.message });
  }

  return (
    <form action={onSubmit} className="mt-4 space-y-3">
      <input required name="name" placeholder="Full name" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <input required type="email" name="email" placeholder="Email" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <input required name="phone" placeholder="Phone" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <textarea name="message" rows={3} placeholder="Message" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <button disabled={state.loading} className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white">
        {state.loading ? "Sending..." : "Send enquiry"}
      </button>
      {state.message ? <p className="text-sm text-emerald-700">{state.message}</p> : null}
      {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
    </form>
  );
}
