"use client";

import { useState } from "react";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    if (password !== confirmPassword) {
      setState({ ok: false, message: "Passwords do not match." });
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    const data = await res.json();
    setState({ ok: res.ok, message: data.error ?? "Password updated successfully. You can now sign in." });
  }

  return (
    <form className="stack-form card-pad" action={onSubmit}>
      <label htmlFor="password">New password<input id="password" name="password" type="password" required minLength={8} /></label>
      <label htmlFor="confirmPassword">Confirm password<input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} /></label>
      <button className="btn btn-primary" type="submit" disabled={!token}>Update password</button>
      {!token && <p className="form-error">Invalid reset link. Request a new password reset.</p>}
      {state && <p className={state.ok ? "form-ok" : "form-error"} role="status">{state.message}</p>}
    </form>
  );
}
