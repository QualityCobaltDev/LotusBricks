"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resolvePlan } from "@/lib/plans";

export function ContactForm() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const prefill = useMemo(() => {
    const plan = resolvePlan(searchParams.get("plan"));
    const inquiryType = searchParams.get("inquiry") || (plan.key === "custom" ? "more-than-10-listings" : "standard-signup");
    const subject = plan.key === "custom" ? "Custom Tier Inquiry" : `${plan.name} Subscription Inquiry`;
    const messageValue = plan.key === "custom"
      ? "We need more than 10 listings and want a tailored Custom Tier quote."
      : `I want to start on ${plan.name}. Please share onboarding and payment steps including the one-time sign-up fee.`;

    return { planName: plan.name, inquiryType, subject, messageValue };
  }, [searchParams]);

  async function submit(formData: FormData) {
    setMessage("");
    setError("");
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    if (!res.ok) return setError(json.error || "Failed to send");
    setMessage(json.message);
  }

  return (
    <form action={submit} className="grid gap-3 md:grid-cols-2">
      <input required name="name" placeholder="Full name" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input required type="email" name="email" placeholder="Email" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input name="phone" placeholder="Phone" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input name="company" placeholder="Company / Agency" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input type="number" min={1} name="listingsRequired" placeholder="Listings required" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input name="inquiryType" defaultValue={prefill.inquiryType} placeholder="Inquiry type" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input required name="subject" defaultValue={prefill.subject} placeholder="Subject" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm md:col-span-2" />
      <textarea required name="message" defaultValue={prefill.messageValue} rows={4} placeholder="Message" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm md:col-span-2" />
      <input type="hidden" name="selectedPlan" value={prefill.planName} />
      <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white md:col-span-2">Send message</button>
      {message ? <p className="text-sm text-success-700 md:col-span-2">{message}</p> : null}
      {error ? <p className="text-sm text-secondary-700 md:col-span-2">{error}</p> : null}
    </form>
  );
}
