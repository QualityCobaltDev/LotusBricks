"use client";

import { useState } from "react";

type InquiryFormState = "idle" | "ok" | "error";

export function InquiryForm({ listingId, compact = false }: { listingId: string; compact?: boolean }) {
  const [state, setState] = useState<InquiryFormState>("idle");

  async function submit(formData: FormData) {
    setState("idle");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        inquiryType: "LISTING",
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "/listings",
        honeypot: String(formData.get("website") ?? ""),
        fullName: String(formData.get("fullName")),
        email: String(formData.get("email")),
        phone: String(formData.get("phone") ?? ""),
        message: String(formData.get("message"))
      })
    });
    setState(res.ok ? "ok" : "error");
  }

  return (
    <form action={submit} className={compact ? "compact-form" : "stack-form"}>
      <input name="fullName" placeholder="Full name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone (optional)" />
      <input name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden />
      <textarea name="message" placeholder="Tell us your timeline, budget, and goals." required minLength={10} />
      <button className="btn btn-primary">Send inquiry</button>
      {state === "ok" && <p className="form-ok">We’ve received your enquiry. Our team will contact you shortly via phone or email.</p>}
      {state === "error" && <p className="form-error">Unable to submit right now. Please contact (+855) 011 389 625.</p>}
    </form>
  );
}
