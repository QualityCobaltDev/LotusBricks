"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Section } from "@/components/site/section";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string>();
  async function onSubmit(formData: FormData) {
    const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.get("email") }) });
    const json = await res.json();
    setMessage(json.resetToken ? `${json.message} Dev reset token: ${json.resetToken}` : json.message || "Submitted");
  }

  return <Section className="py-12"><div className="mx-auto max-w-md rounded-2xl border bg-white p-6"><h1 className="text-xl font-semibold">Forgot password</h1><form action={onSubmit} className="mt-4 space-y-3"><input name="email" type="email" required className="w-full rounded border px-3 py-2" placeholder="Email"/><button className="w-full rounded bg-primary-600 px-4 py-2 text-white">Send reset link</button></form>{message ? <p className="mt-3 text-sm">{message}</p> : null}</div></Section>;
}
