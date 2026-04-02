"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics/events";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const [status, setStatus] = useState<string>("");

  async function onSubmit(formData: FormData) {
    setStatus("");
    const email = String(formData.get("email") ?? "");
    trackEvent("password_reset_request");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setStatus(
      data.message ?? "If an account exists, a reset link has been sent.",
    );
  }

  return (
    <section className="shell section narrow">
      <h1>{t("title")}</h1>
      <p className="muted">{t("subtitle")}</p>
      <form className="stack-form card-pad" action={onSubmit}>
        <label htmlFor="email">
          {t("accountEmail")}
          <input id="email" name="email" type="email" required />
        </label>
        <button className="btn btn-primary" type="submit">
          {t("requestResetLink")}
        </button>
        <p className="muted">
          {t.rich("noEmailReceived", {
            email: () => (
              <a key="e" href={CONTACT.emailHref}>
                {CONTACT.email}
              </a>
            ),
          })}
        </p>
        {status && (
          <p className="form-ok" role="status">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}
