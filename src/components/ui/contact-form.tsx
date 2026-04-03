"use client";

import { useEffect, useMemo, useState } from "react";
import { CONTACT } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics/events";
import { buildContactHref, normalizeContactPlan, normalizeContactSource } from "@/lib/routing";

type ContactFormProps = {
  listingId?: string;
  selectedPlan?: string;
  source?: string;
  inquiryType?: "LISTING" | "CUSTOM_PLAN" | "GENERAL" | "CONTACT" | "VALUATION" | "LISTING_SUBMISSION";
};

const PLAN_LABELS: Record<string, string> = {
  TIER_1: "Tier 1",
  TIER_2: "Tier 2",
  TIER_3: "Tier 3",
  CUSTOM: "Custom Plan"
};

const ATTRIBUTION_KEY = "rb_contact_attribution_v1";

export function ContactForm({ listingId = "", selectedPlan = "", source = "direct", inquiryType = "CONTACT" }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [plan, setPlan] = useState(normalizeContactPlan(selectedPlan));
  const [sourceValue, setSourceValue] = useState(normalizeContactSource(source));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryPlan = normalizeContactPlan(params.get("plan") ?? "");
    const querySource = normalizeContactSource(params.get("source") ?? "");
    const persisted = window.localStorage.getItem(ATTRIBUTION_KEY);
    let parsed: { plan?: string; source?: string } = {};
    try {
      parsed = persisted ? JSON.parse(persisted) as { plan?: string; source?: string } : {};
    } catch {
      parsed = {};
    }
    const nextPlan = queryPlan || normalizeContactPlan(parsed.plan ?? "") || normalizeContactPlan(selectedPlan);
    const nextSource = normalizeContactSource(querySource || parsed.source || source);
    setPlan(nextPlan);
    setSourceValue(nextSource);
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify({ plan: nextPlan, source: nextSource }));
  }, [selectedPlan, source]);

  const planLabel = useMemo(() => PLAN_LABELS[plan] ?? "Sales consultation", [plan]);

  async function onSubmit(formData: FormData) {
    if (submitting) return;
    setSubmitting(true);
    setStatus("idle");
    trackEvent("contact_form_submit", { inquiryType, selectedPlan: plan, source: sourceValue });
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        selectedPlan: plan || String(formData.get("selectedPlan") ?? ""),
        inquiryType,
        honeypot: String(formData.get("website") ?? ""),
        sourcePage: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : buildContactHref({ source: sourceValue, plan }),
        fullName: String(formData.get("fullName")),
        email: String(formData.get("email")),
        phone: String(formData.get("phone") ?? ""),
        preferredContact: String(formData.get("preferredContact") ?? "EMAIL"),
        requestedListings: Number(formData.get("requestedListings") || 0) || undefined,
        message: String(formData.get("message"))
      })
    });
    setStatus(res.ok ? "ok" : "error");
    setSubmitting(false);
  }

  function onStart() {
    if (started) return;
    setStarted(true);
    trackEvent("contact_form_start", { inquiryType, selectedPlan: plan, source: sourceValue });
  }

  return (
    <form action={onSubmit} className="stack-form conversion-form" onFocusCapture={onStart}>
      <div className="form-context-card" role="status" aria-live="polite">
        <strong>You’re enquiring about {planLabel}.</strong>
        <small className="muted">Expected response: within a few business hours. Prefer urgent support? Use WhatsApp or phone below.</small>
      </div>
      <label htmlFor="fullName">Full name<input id="fullName" name="fullName" required /></label>
      <label htmlFor="email">Email<input id="email" name="email" type="email" required aria-describedby="reply-help" /></label>
      <small id="reply-help" className="muted">We respond quickly from {CONTACT.email}.</small>
      <label htmlFor="phone">Phone (optional)<input id="phone" name="phone" placeholder="(+855)" /></label>
      <label htmlFor="preferredContact">Preferred contact method
        <select id="preferredContact" name="preferredContact" defaultValue="EMAIL">
          <option value="EMAIL">Email</option>
          <option value="PHONE">Phone</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="TELEGRAM">Telegram</option>
        </select>
      </label>
      {!!plan && <input type="hidden" id="selectedPlan" name="selectedPlan" value={plan} />}
      <input type="hidden" id="source" name="source" value={sourceValue} />
      {inquiryType === "CUSTOM_PLAN" && <label htmlFor="requestedListings">Listings needed<input id="requestedListings" name="requestedListings" type="number" min={11} placeholder="e.g. 25" required /></label>}
      <label htmlFor="message">How can we help?<textarea id="message" name="message" required minLength={10} placeholder="Tell us your goal, budget, and preferred location." /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden />
      <button className="btn btn-primary" disabled={submitting}>{submitting ? "Sending..." : "Get My Next Steps"}</button>
      <p className="muted">No obligation. Direct contact with our sales and advisory team.</p>
      {status === "ok" && <div className="form-success-card"><p className="form-ok">Thanks — your request is confirmed. Our team will respond within a few hours.</p><p className="muted">Next step: watch for our message, or continue now via <a href={CONTACT.whatsappHref} data-track-event="whatsapp_click" data-track-label="contact-success">WhatsApp</a> / <a href={CONTACT.telegramHref} data-track-event="telegram_click" data-track-label="contact-success">Telegram</a>.</p></div>}
      {status === "error" && <p className="form-error">Submission failed. Please email {CONTACT.email}.</p>}
    </form>
  );
}
