"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validateEmail } from "@/lib/auth";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const email = String(new FormData(event.currentTarget).get("email") ?? "");
        setMessage(validateEmail(email) ? `Reset instructions sent to ${email}.` : "Enter a valid email.");
      }}
    >
      <FormField label="Email" help={message || "We'll email a secure reset link."}>
        <Input name="email" type="email" required />
      </FormField>
      <Button type="submit">Send reset link</Button>
    </form>
  );
}
