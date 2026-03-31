"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const search = useSearchParams();
  const [state, setState] = useState<{ loading: boolean; error?: string }>({ loading: false });

  async function onSubmit(formData: FormData) {
    setState({ loading: true });
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: formData.get("identifier"), password: formData.get("password") })
    });
    const json = await res.json();
    if (!res.ok) return setState({ loading: false, error: json.error ?? "Login failed" });
    window.location.href = json.role === "ADMIN" || json.role === "OPS" ? "/admin" : (search.get("redirect") || "/account");
  }

  return (
    <form action={onSubmit} className="mt-4 space-y-3">
      <input name="identifier" required placeholder="Email or username" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input name="password" required type="password" placeholder="Password" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <button disabled={state.loading} className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white">{state.loading ? "Signing in..." : "Sign in"}</button>
      {search.get("error") === "unauthorized" ? <p className="text-sm text-secondary-700">You do not have permission to access admin resources.</p> : null}
      {state.error ? <p className="text-sm text-secondary-700">{state.error}</p> : null}
    </form>
  );
}
