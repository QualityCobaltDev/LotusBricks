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
    <form action={submit} className={`${compact ? "compact-form" : "stack-form"} conversion-form form-shell`} onFocusCapture={onStart} aria-describedby="inquiry-form-disclaimer">
      <div className="form-context-card">
        <strong>Secure enquiry to the RightBricks property team.</strong>
        <small className="muted">We normally reply within a few business hours with viewing options and full details.</small>
      </div>
      <div className="form-grid-2">
        <label htmlFor="inquiry-full-name">Full name
          <input id="inquiry-full-name" name="fullName" placeholder="Enter your full name" autoComplete="name" required />
        </label>
        <label htmlFor="inquiry-email">Email
          <input id="inquiry-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </label>
      </div>
      <label htmlFor="inquiry-phone">Phone (recommended for faster follow-up)
        <input id="inquiry-phone" name="phone" placeholder="+855…" minLength={7} autoComplete="tel" />
      </label>
      <div className="form-grid-2">
        <label className="muted" htmlFor="inquiry-contact">Preferred contact method
          <select id="inquiry-contact" name="preferredContact" defaultValue="EMAIL">
            <option value="WHATSAPP">WhatsApp (Fastest)</option><option value="PHONE">Phone call</option><option value="EMAIL">Email</option><option value="TELEGRAM">Telegram</option>
          </select>
        </label>
        <label className="muted" htmlFor="inquiry-interest">Interest type
          <select id="inquiry-interest" name="interestType" defaultValue="Viewing Request">
            <option value="Viewing Request">Viewing Request</option><option value="Price Negotiation">Price Negotiation</option><option value="Investment Evaluation">Investment Evaluation</option><option value="General Enquiry">General Enquiry</option>
          </select>
        </label>
      </div>
      <label className="muted" htmlFor="inquiry-date">Preferred viewing date
        <input id="inquiry-date" name="preferredViewingDate" type="date" />
      </label>
      <label htmlFor="inquiry-message">Your enquiry
        <textarea id="inquiry-message" name="message" defaultValue={initialMessage ?? "Hello RightBricks, I am interested in this property. Please share more details and viewing availability."} placeholder="Tell us your timeline, budget, and goals." required minLength={10} />
      </label>
      <label className="sr-only" htmlFor="inquiry-website">Website</label>
      <input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden />
      <button className="btn btn-primary" disabled={submitting} aria-busy={submitting}>{submitting ? "Submitting..." : "Request Property Details"}</button>
      <p id="inquiry-form-disclaimer" className="muted">No obligation. Trusted RightBricks advisor follow-up and clear next steps.</p>
      {state === "ok" && <div className="form-success-card" role="status"><p className="form-ok">Thank you — your property enquiry is confirmed.</p><p className="muted">Next step: our team will share details and viewing availability shortly. Need faster help? <a href={CONTACT.whatsappHref} data-track-event="whatsapp_click" data-track-label="listing-enquiry-success">Chat on WhatsApp</a>.</p></div>}
      {state === "error" && <p className="form-error" role="alert">Unable to submit right now. Please contact {CONTACT.email} or call {CONTACT.phoneDisplay}.</p>}
    </form>
  );
}
