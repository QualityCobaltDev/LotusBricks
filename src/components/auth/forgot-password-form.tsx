"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const email = String(new FormData(event.currentTarget).get("email") ?? "");
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        setMessage(data.message || "Request received");
      }}
    >
      <FormField label="Email" help={message || "We'll email a secure reset link."}><Input name="email" type="email" required /></FormField>
      <Button type="submit">Send reset link</Button>
    </form>
  );
}
