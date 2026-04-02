"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics/events";
import { useTranslations } from "next-intl";

type ContactFormProps = {
  listingId?: string;
  selectedPlan?: string;
  inquiryType?: "LISTING" | "CUSTOM_PLAN" | "GENERAL" | "CONTACT" | "VALUATION" | "LISTING_SUBMISSION";
};

export function ContactForm({ listingId = "", selectedPlan = "", inquiryType = "CONTACT" }: ContactFormProps) {
  const t = useTranslations("contactForm");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [started, setStarted] = useState(false);

  async function onSubmit(formData: FormData) {
    setStatus("idle");
    trackEvent("contact_form_submit", { inquiryType, selectedPlan });
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        selectedPlan: selectedPlan || String(formData.get("selectedPlan") ?? ""),
        inquiryType,
        honeypot: String(formData.get("website") ?? ""),
        sourcePage: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/contact",
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

  function onStart() {
    if (started) return;
    setStarted(true);
    trackEvent("contact_form_start", { inquiryType, selectedPlan });
  }

  return (
    <form action={onSubmit} className="stack-form" onFocusCapture={onStart}>
      <label htmlFor="fullName">{t("fullName")}<input id="fullName" name="fullName" required /></label>
      <label htmlFor="email">{t("email")}<input id="email" name="email" type="email" required aria-describedby="reply-help" /></label>
      <small id="reply-help" className="muted">{t("repliesSentFrom", { email: CONTACT.email })}</small>
      <label htmlFor="phone">{t("phone")}<input id="phone" name="phone" placeholder={t("phonePlaceholder")} /></label>
      <label htmlFor="companyName">{t("companyAgency")}<input id="companyName" name="companyName" /></label>
      <label htmlFor="preferredContact">{t("preferredContact")}
        <select id="preferredContact" name="preferredContact" defaultValue="EMAIL">
          <option value="EMAIL">{t("emailOption")}</option>
          <option value="PHONE">{t("phoneOption")}</option>
          <option value="WHATSAPP">{t("whatsappOption")}</option>
          <option value="TELEGRAM">{t("telegramOption")}</option>
        </select>
      </label>
      <label htmlFor="selectedPlan">{t("plan")}<input id="selectedPlan" name="selectedPlan" defaultValue={selectedPlan} /></label>
      {inquiryType === "CUSTOM_PLAN" && <label htmlFor="requestedListings">{t("listingsNeeded")}<input id="requestedListings" name="requestedListings" type="number" min={11} placeholder={t("listingsPlaceholder")} required /></label>}
      <label htmlFor="message">{t("howCanWeHelp")}<textarea id="message" name="message" required minLength={10} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden />
      <button className="btn btn-primary">{t("sendMessage")}</button>
      <p className="muted">{CONTACT.standardLine}</p>
      {status === "ok" && <p className="form-ok">{t("successMessage")}</p>}
      {status === "error" && <p className="form-error">{t("errorMessage", { email: CONTACT.email })}</p>}
    </form>
  );
}
