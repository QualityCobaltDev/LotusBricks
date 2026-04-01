"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuthErrorResponse, AuthSuccessResponse } from "@/lib/auth-contract";
import { toSignInErrorMessage } from "@/lib/auth-client";

export function SignInForm() {
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
          remember: Boolean(formData.get("remember"))
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
      setError("Authentication service is temporarily unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={onSubmit} className="stack-form" noValidate>
      <label htmlFor="email">Email<input id="email" name="email" type="email" required autoComplete="email" /></label>
      <label htmlFor="password">
        Password
        <div className="password-row">
          <input id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" minLength={8} />
          <button type="button" className="btn btn-ghost" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </label>
      <label className="remember"><input type="checkbox" name="remember" />Remember me for 30 days</label>
      <button className="btn btn-primary" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
      <Link href="/support/forgot-password" className="muted">Forgot password?</Link>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
