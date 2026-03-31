"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/auth";
import { routes } from "@/lib/routes";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);
        const result = await register({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? "")
        });
        if (!result.ok) return setError(result.message ?? "Could not register.");
        router.push(routes.account);
      }}
    >
      <FormField label="Full name" error={error ?? undefined}><Input name="name" required /></FormField>
      <FormField label="Email"><Input name="email" type="email" required /></FormField>
      <FormField label="Password" help="At least 8 characters."><Input name="password" type="password" minLength={8} required /></FormField>
      <Button type="submit">Create account</Button>
    </form>
  );
}
