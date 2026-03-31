"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [state, setState] = useState<{ loading: boolean; error?: string }>({ loading: false });

  async function onSubmit(formData: FormData) {
    setState({ loading: true });
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        username: formData.get("username"),
        fullName: formData.get("fullName"),
        password: formData.get("password")
      })
    });
    const json = await res.json();
    if (!res.ok) return setState({ loading: false, error: json.error || "Could not create account" });
    router.push("/account");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="mt-4 space-y-3">
      <input name="fullName" required placeholder="Full name" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input name="username" required placeholder="Username" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input name="email" required type="email" placeholder="Email" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <input name="password" required type="password" minLength={8} placeholder="Password" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      <button disabled={state.loading} className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white">{state.loading ? "Creating account..." : "Create account"}</button>
      {state.error ? <p className="text-sm text-secondary-700">{state.error}</p> : null}
    </form>
  );
}
