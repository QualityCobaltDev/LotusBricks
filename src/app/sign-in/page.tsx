"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(formData: FormData) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Unable to sign in");
      return;
    }

    router.push(data.redirectTo);
  }

  return (
    <section className="shell signin-wrap">
      <article className="signin-aside">
        <h1>Welcome back to RightBricks</h1>
        <p>Securely access saved listings, inquiries, and portfolio workflows from one trusted workspace.</p>
        <ul className="check-list">
          <li>Verified listing insights and transparent pricing context.</li>
          <li>Saved opportunities synced across your account.</li>
          <li>Fast communication with advisors and listing partners.</li>
        </ul>
      </article>

      <article className="signin-card">
        <h2>Sign in</h2>
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
          <button className="btn btn-primary">Sign in</button>
          <a href="#" className="muted">Forgot password?</a>
          {error && <p className="form-error">{error}</p>}
        </form>
      </article>
    </section>
  );
}
