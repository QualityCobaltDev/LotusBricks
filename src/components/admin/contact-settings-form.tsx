"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/contact";

type ContactSettings = {
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  whatsappHref?: string;
  telegramHref?: string;
  supportHours?: string;
  supportAddress?: string;
};

export function ContactSettingsForm({ initial }: { initial: ContactSettings }) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function onSubmit(formData: FormData) {
    setStatus("idle");
    const payload = {
      phoneDisplay: CONTACT.phoneDisplay,
      phoneHref: CONTACT.phoneHref,
      email: CONTACT.email,
      emailHref: CONTACT.emailHref,
      whatsappHref: CONTACT.whatsappHref,
      telegramHref: CONTACT.telegramHref,
      supportHours: String(formData.get("supportHours") ?? ""),
      supportAddress: String(formData.get("supportAddress") ?? "")
    };

    const res = await fetch("/api/admin/contact-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setStatus(res.ok ? "ok" : "error");
  }

  return (
    <form action={onSubmit} className="stack-form card-pad">
      <h2>Contact & messaging settings</h2>
      <p className="muted">Primary contact identity is locked to brand standard for consistency.</p>
      <label>Phone display<input value={CONTACT.phoneDisplay} disabled readOnly /></label>
      <label>Phone link<input value={CONTACT.phoneHref} disabled readOnly /></label>
      <label>Support email<input value={CONTACT.email} disabled readOnly /></label>
      <label>Email link<input value={CONTACT.emailHref} disabled readOnly /></label>
      <label>WhatsApp<input value={CONTACT.whatsappHref} disabled readOnly /></label>
      <label>Telegram<input value={CONTACT.telegramHref} disabled readOnly /></label>
      <label>Support hours<input name="supportHours" defaultValue={initial.supportHours} /></label>
      <label>Support address<textarea name="supportAddress" defaultValue={initial.supportAddress} /></label>
      <button className="btn btn-primary" type="submit">Save contact settings</button>
      {status === "ok" && <p className="form-ok">Settings updated.</p>}
      {status === "error" && <p className="form-error">Unable to update settings.</p>}
    </form>
  );
}
