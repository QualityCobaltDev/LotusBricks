"use client";

import { useState } from "react";

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
      <label>Full name<input name="fullName" required /></label>
      <label>Email<input name="email" type="email" required /></label>
      <label>Phone<input name="phone" /></label>
      <label>Company / Agency<input name="companyName" /></label>
      <label>Plan<input name="selectedPlan" defaultValue={selectedPlan} /></label>
      {inquiryType === "CUSTOM_PLAN" && <label>Listings needed<input name="requestedListings" type="number" min={11} placeholder="e.g. 25" required /></label>}
      <label>How can we help?<textarea name="message" required minLength={10} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden />
      <button className="btn btn-primary">Send message</button>
      {status === "ok" && <p className="form-ok">We’ve received your enquiry. Our team will contact you shortly via phone or email.</p>}
      {status === "error" && <p className="form-error">Submission failed. Please email contact@rightbricks.online.</p>}
    </form>
  );
}
