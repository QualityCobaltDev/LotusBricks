"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type InquiryFormState = "idle" | "ok" | "error";

export function InquiryForm({ listingId, compact = false, initialMessage }: { listingId: string; compact?: boolean; initialMessage?: string }) {
  const t = useTranslations("inquiryForm");
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
      <input name="fullName" placeholder={t("fullName")} required />
      <input name="email" type="email" placeholder={t("email")} required />
      <input name="phone" placeholder={t("phone")} />
      <label className="muted">{t("preferredContact")}
        <select name="preferredContact" defaultValue="EMAIL">
          <option value="EMAIL">{t("emailOption")}</option><option value="PHONE">{t("phoneOption")}</option><option value="WHATSAPP">{t("whatsappOption")}</option><option value="TELEGRAM">{t("telegramOption")}</option>
        </select>
      </label>
      <label className="muted">{t("interestType")}
        <select name="interestType" defaultValue="Viewing Request">
          <option value="Viewing Request">{t("viewingRequest")}</option><option value="Price Negotiation">{t("priceNegotiation")}</option><option value="Investment Evaluation">{t("investmentEvaluation")}</option><option value="General Enquiry">{t("generalEnquiry")}</option>
        </select>
      </label>
      <label className="muted">{t("preferredViewingDate")}
        <input name="preferredViewingDate" type="date" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden />
      <textarea name="message" defaultValue={initialMessage ?? t("defaultMessage")} placeholder={t("messagePlaceholder")} required minLength={10} />
      <button className="btn btn-primary">{t("sendInquiry")}</button>
      {state === "ok" && <p className="form-ok">{t("successMessage")}</p>}
      {state === "error" && <p className="form-error">{t("errorMessage")}</p>}
    </form>
  );
}
