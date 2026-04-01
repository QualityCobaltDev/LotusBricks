"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/contact";

type ContactFormProps = {
  listingId?: string;
  selectedPlan?: string;
  inquiryType?: "LISTING" | "CUSTOM_PLAN" | "GENERAL" | "CONTACT" | "VALUATION" | "LISTING_SUBMISSION";
};

export function ContactForm({ listingId = "", selectedPlan = "", inquiryType = "CONTACT" }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function onSubmit(formData: FormData) {
    setStatus("idle");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        selectedPlan: selectedPlan || String(formData.get("selectedPlan") ?? ""),
        inquiryType,
        honeypot: String(formData.get("website") ?? ""),
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "/contact",
        fullName: String(formData.get("fullName")),
        email: String(formData.get("email")),
        phone: String(formData.get("phone") ?? ""),
        companyName: String(formData.get("companyName") ?? ""),
        requestedListings: Number(formData.get("requestedListings") || 0) || undefined,
        message: String(formData.get("message"))
      })
    });
    setStatus(res.ok ? "ok" : "error");
  }

  return (
    <form action={onSubmit} className="stack-form">
      <label htmlFor="fullName">Full name<input id="fullName" name="fullName" required /></label>
      <label htmlFor="email">Email<input id="email" name="email" type="email" required aria-describedby="reply-help" /></label>
      <small id="reply-help" className="muted">Replies are sent from {CONTACT.email}.</small>
      <label htmlFor="phone">Phone<input id="phone" name="phone" placeholder="(+855)" /></label>
      <label htmlFor="companyName">Company / Agency<input id="companyName" name="companyName" /></label>
      <label htmlFor="preferredContact">Preferred contact method
        <select id="preferredContact" name="preferredContact" defaultValue="EMAIL">
          <option value="EMAIL">Email</option>
          <option value="PHONE">Phone</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="TELEGRAM">Telegram</option>
        </select>
      </label>
      <label htmlFor="selectedPlan">Plan<input id="selectedPlan" name="selectedPlan" defaultValue={selectedPlan} /></label>
      {inquiryType === "CUSTOM_PLAN" && <label htmlFor="requestedListings">Listings needed<input id="requestedListings" name="requestedListings" type="number" min={11} placeholder="e.g. 25" required /></label>}
      <label htmlFor="message">How can we help?<textarea id="message" name="message" required minLength={10} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden />
      <button className="btn btn-primary">Send message</button>
      <p className="muted">{CONTACT.standardLine}</p>
      {status === "ok" && <p className="form-ok">Thanks — our team will respond within a few hours.</p>}
      {status === "error" && <p className="form-error">Submission failed. Please email {CONTACT.email}.</p>}
    </form>
  );
}
