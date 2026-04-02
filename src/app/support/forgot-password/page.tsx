"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics/events";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<string>("");

  async function onSubmit(formData: FormData) {
    setStatus("");
    const email = String(formData.get("email") ?? "");
    trackEvent("password_reset_request");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setStatus(data.message ?? "If an account exists, a reset link has been sent.");
  }

  return (
    <section className="shell section narrow">
      <h1>Reset your password</h1>
      <p className="muted">Enter your account email and we&apos;ll send reset instructions within a few minutes.</p>
      <form className="stack-form card-pad" action={onSubmit}>
        <label htmlFor="email">Account email<input id="email" name="email" type="email" required /></label>
        <button className="btn btn-primary" type="submit">Request reset link</button>
        <p className="muted">If you don&apos;t receive an email, contact <a href={CONTACT.emailHref}>{CONTACT.email}</a></p>
        {status && <p className="form-ok" role="status">{status}</p>}
      </form>
    </section>
  );
}
