"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/site/section";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  async function onSubmit(formData: FormData) {
    const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: formData.get("token"), password: formData.get("password") }) });
    const json = await res.json();
    if (!res.ok) return setError(json.error || "Failed");
    router.push("/auth/login");
  }

  return <Section className="py-12"><div className="mx-auto max-w-md rounded-2xl border bg-white p-6"><h1 className="text-xl font-semibold">Reset password</h1><form action={onSubmit} className="mt-4 space-y-3"><input name="token" required className="w-full rounded border px-3 py-2" placeholder="Reset token"/><input name="password" type="password" required minLength={8} className="w-full rounded border px-3 py-2" placeholder="New password"/><button className="w-full rounded bg-primary-600 px-4 py-2 text-white">Update password</button></form>{error ? <p className="mt-3 text-sm text-secondary-700">{error}</p> : null}</div></Section>;
}
