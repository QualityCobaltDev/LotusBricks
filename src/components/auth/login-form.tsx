"use client";

import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { routes } from "@/lib/routes";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || routes.account;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        const result = await login({ email, password });
        setLoading(false);
        if (!result.ok) return setError(result.message ?? "Login failed.");
        const destination = result.role === "admin" && next === routes.account ? routes.admin : next;
        router.push(destination as Route);
      }}
    >
      <FormField label="Email" error={error ?? undefined}><Input name="email" type="email" required /></FormField>
      <FormField label="Password"><Input name="password" type="password" minLength={8} required /></FormField>
      <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
    </form>
  );
}
