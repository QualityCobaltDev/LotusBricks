"use client";

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
          password: formData.get("password")
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
    <form action={onSubmit} className="stack-form">
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>
        Password
        <div className="password-row">
          <input name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" />
          <button type="button" className="btn btn-ghost" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </label>
      <label className="remember"><input type="checkbox" name="remember" />Remember me</label>
      <button className="btn btn-primary" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
      <a href="#" className="muted">Forgot password?</a>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
