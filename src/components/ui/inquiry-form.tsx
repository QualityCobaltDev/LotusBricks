"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics/events";

type InquiryFormState = "idle" | "ok" | "error";

export function InquiryForm({ listingId, compact = false, initialMessage }: { listingId: string; compact?: boolean; initialMessage?: string }) {
  const [state, setState] = useState<InquiryFormState>("idle");
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(formData: FormData) {
    if (submitting) return;
    setSubmitting(true);
    setState("idle");
    trackEvent("listing_enquiry_submit", { listingId });
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
    setSubmitting(false);
  }

  function onStart() {
    if (started) return;
    setStarted(true);
    trackEvent("listing_enquiry_start", { listingId });
  }

  return (
    <form action={submit} className={`${compact ? "compact-form" : "stack-form"} conversion-form`} onFocusCapture={onStart}>
      <div className="form-context-card">
        <strong>Secure enquiry to the RightBricks property team.</strong>
        <small className="muted">We normally reply within a few business hours with viewing options and full details.</small>
      </div>
      <input name="fullName" placeholder="Full name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone (recommended for faster follow-up)" minLength={7} />
      <label className="muted">Preferred contact method
        <select name="preferredContact" defaultValue="EMAIL">
          <option value="WHATSAPP">WhatsApp (Fastest)</option><option value="PHONE">Phone call</option><option value="EMAIL">Email</option><option value="TELEGRAM">Telegram</option>
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
      <button className="btn btn-primary" disabled={submitting}>{submitting ? "Submitting..." : "Request Property Details"}</button>
      <p className="muted">No obligation. Trusted RightBricks advisor follow-up and clear next steps.</p>
      {state === "ok" && <div className="form-success-card"><p className="form-ok">Thank you — your property enquiry is confirmed.</p><p className="muted">Next step: our team will share details and viewing availability shortly. Need faster help? <a href={CONTACT.whatsappHref} data-track-event="whatsapp_click" data-track-label="listing-enquiry-success">Chat on WhatsApp</a>.</p></div>}
      {state === "error" && <p className="form-error">Unable to submit right now. Please contact {CONTACT.email} or call {CONTACT.phoneDisplay}.</p>}
    </form>
  );
}
