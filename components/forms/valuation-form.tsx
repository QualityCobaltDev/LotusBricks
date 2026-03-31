"use client";

import { useState } from "react";

export function ValuationForm() {
  const [feedback, setFeedback] = useState<string>("");

  async function submit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/leads/valuation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    setFeedback(json.message || json.error || "Request sent");
  }

  return (
    <form action={submit} className="mt-5 grid gap-3 md:grid-cols-2">
      <input required name="name" placeholder="Full name" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input required name="phone" placeholder="Phone" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input required type="email" name="email" placeholder="Email" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input required name="city" placeholder="City" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input required name="propertyType" placeholder="Property type" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm md:col-span-2" />
      <textarea required name="details" placeholder="Property details" rows={4} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm md:col-span-2" />
      <button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white md:col-span-2">Submit request</button>
      {feedback ? <p className="text-sm text-success-700 md:col-span-2">{feedback}</p> : null}
    </form>
  );
}
