"use client";

import { useState } from "react";

type InquiryFormState = "idle" | "ok" | "error";

export function InquiryForm({ listingId, compact = false, initialMessage }: { listingId: string; compact?: boolean; initialMessage?: string }) {
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
        preferredContact: String(formData.get("preferredContact") ?? "EMAIL"),
        interestType: String(formData.get("interestType") ?? "General enquiry"),
        preferredViewingDate: String(formData.get("preferredViewingDate") ?? ""),
        message: String(formData.get("message"))
      })
    });
    setState(res.ok ? "ok" : "error");
  }

  return (
    <form action={submit} className={compact ? "compact-form" : "stack-form"}>
      <input name="fullName" placeholder="Full name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone (optional, e.g. (+855) 011 389 625)" />
      <label className="muted">Preferred contact method
        <select name="preferredContact" defaultValue="EMAIL">
          <option value="EMAIL">Email</option><option value="PHONE">Phone</option><option value="WHATSAPP">WhatsApp</option><option value="TELEGRAM">Telegram</option>
        </select>
      </label>
      <label className="muted">Interest type
        <select name="interestType" defaultValue="Viewing Request">
          <option value="Viewing Request">Viewing Request</option><option value="Price Negotiation">Price Negotiation</option><option value="Investment Evaluation">Investment Evaluation</option><option value="General Enquiry">General Enquiry</option>
        </select>
      </label>
      <label className="muted">Preferred viewing date
        <input name="preferredViewingDate" type="date" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden />
      <textarea name="message" defaultValue={initialMessage ?? "Hello RightBricks, I am interested in this property. Please share more details and viewing availability."} placeholder="Tell us your timeline, budget, and goals." required minLength={10} />
      <button className="btn btn-primary">Send inquiry</button>
      {state === "ok" && <p className="form-ok">We’ve received your enquiry. Our team will contact you shortly via phone or email.</p>}
      {state === "error" && <p className="form-error">Unable to submit right now. Please contact contact@rightbricks.online or call (+855) 011 389 625.</p>}
    </form>
  );
}
