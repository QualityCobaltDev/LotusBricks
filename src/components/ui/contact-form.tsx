"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const params = useSearchParams();
  const [sent, setSent] = useState(false);

  const plan = params.get("plan") ?? "";
  const inquiry = params.get("inquiry") ?? "general";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <FormField label="Name">
        <Input name="name" required />
      </FormField>
      <FormField label="Email">
        <Input name="email" type="email" required />
      </FormField>
      <FormField label="Phone">
        <Input name="phone" type="tel" required />
      </FormField>
      <FormField label="Message" help={sent ? "Thanks. Our team will follow up shortly." : "Tell us what you need."}>
        <textarea className="textarea" name="message" defaultValue={`Inquiry: ${inquiry}${plan ? `\nPlan: ${plan}` : ""}`} required />
      </FormField>
      <Button type="submit">Send message</Button>
    </form>
  );
}
