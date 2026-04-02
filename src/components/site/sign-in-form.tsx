"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AuthErrorResponse, AuthSuccessResponse } from "@/lib/auth-contract";
import { toSignInErrorMessage } from "@/lib/auth-client";

export function SignInForm({ role }: { role: "ADMIN" | "CUSTOMER" }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(formData: FormData) {
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          remember: Boolean(formData.get("remember")),
          role
        })
      });

      const data = (await res.json()) as AuthSuccessResponse | AuthErrorResponse;
      if (!res.ok || !data.success) {
        setError(toSignInErrorMessage(data && "code" in data ? data : null));
        return;
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch {
      setError(t("serviceUnavailable"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={onSubmit} className="stack-form" noValidate>
      <label htmlFor="email">{t("emailLabel")}<input id="email" name="email" type="email" required autoComplete="email" inputMode="email" /></label>
      <label htmlFor="password">
        {t("passwordLabel")}
        <div className="password-row">
          <input id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" minLength={8} />
          <button type="button" className="btn btn-ghost" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? t("hidePassword") : t("showPassword")}>
            {showPassword ? t("hidePassword") : t("showPassword")}
          </button>
        </div>
      </label>
      <label className="remember"><input type="checkbox" name="remember" />{t("rememberMe")}</label>
      <button className="btn btn-primary" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? t("signingIn") : role === "ADMIN" ? t("signInAsAdmin") : t("signInAsCustomer")}
      </button>
      <Link href="/support/forgot-password" className="muted">{t("forgotPassword")}</Link>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
