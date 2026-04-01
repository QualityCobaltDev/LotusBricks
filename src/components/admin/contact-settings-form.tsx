"use client";

import { useState } from "react";

type ContactSettings = {
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  supportHours?: string;
  supportAddress?: string;
};

export function ContactSettingsForm({ initial }: { initial: ContactSettings }) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function onSubmit(formData: FormData) {
    setStatus("idle");
    const payload = {
      phoneDisplay: String(formData.get("phoneDisplay")),
      phoneHref: String(formData.get("phoneHref")),
      email: String(formData.get("email")),
      emailHref: String(formData.get("emailHref")),
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

  async function sendTestEmail() {
    setStatus("idle");
    const res = await fetch("/api/admin/test-email", { method: "POST" });
    setStatus(res.ok ? "ok" : "error");
  }

  return (
    <form action={onSubmit} className="stack-form card-pad">
      <h2>Contact & email settings</h2>
      <label>Phone display<input name="phoneDisplay" defaultValue={initial.phoneDisplay} required /></label>
      <label>Phone link (tel:)
        <input name="phoneHref" defaultValue={initial.phoneHref} required />
      </label>
      <label>Support email<input name="email" defaultValue={initial.email} required /></label>
      <label>Email link (mailto:)
        <input name="emailHref" defaultValue={initial.emailHref} required />
      </label>
      <label>Support hours<input name="supportHours" defaultValue={initial.supportHours} /></label>
      <label>Support address<textarea name="supportAddress" defaultValue={initial.supportAddress} /></label>
      <div className="hero-actions">
        <button className="btn btn-primary" type="submit">Save contact settings</button>
        <button className="btn btn-ghost" type="button" onClick={sendTestEmail}>Send SMTP test</button>
      </div>
      {status === "ok" && <p className="form-ok">Settings updated and/or test email triggered.</p>}
      {status === "error" && <p className="form-error">Unable to update settings. Check SMTP and payload values.</p>}
    </form>
  );
}
