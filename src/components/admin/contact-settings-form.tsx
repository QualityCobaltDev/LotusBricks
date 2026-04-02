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
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(formData: FormData) {
    setStatus({ type: "idle" });
    setIsSaving(true);

    const payload = {
      phoneDisplay: CONTACT.phoneDisplay,
      phoneHref: CONTACT.phoneHref,
      email: CONTACT.email,
      emailHref: CONTACT.emailHref,
      whatsappHref: CONTACT.whatsappHref,
      telegramHref: CONTACT.telegramHref,
      supportHours: String(formData.get("supportHours") ?? "").trim(),
      supportAddress: String(formData.get("supportAddress") ?? "").trim()
    };

    try {
      const res = await fetch("/api/admin/contact-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setStatus({ type: "error", message: data?.error ?? "Unable to update settings." });
        return;
      }
      setStatus({ type: "ok", message: data?.message ?? "Settings updated." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setIsSaving(false);
    }
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
      <button className="btn btn-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save contact settings"}</button>
      {status.type === "ok" && <p className="form-ok">{status.message}</p>}
      {status.type === "error" && <p className="form-error">Save failed: {status.message}</p>}
    </form>
  );
}
