"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");

  const plan = params.get("plan") ?? "";
  const inquiry = params.get("inquiry") ?? "general";

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("saving");
        const form = new FormData(event.currentTarget);
        const payload = {
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          phone: String(form.get("phone") || ""),
          message: String(form.get("message") || "")
        };
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        setStatus(response.ok ? "ok" : "error");
        if (response.ok) event.currentTarget.reset();
      }}
    >
      <FormField label="Name"><Input name="name" required /></FormField>
      <FormField label="Email"><Input name="email" type="email" required /></FormField>
      <FormField label="Phone"><Input name="phone" type="tel" /></FormField>
      <FormField label="Message" help={status === "ok" ? "Thanks. Our team will follow up shortly." : "Tell us what you need."}>
        <textarea className="textarea" name="message" defaultValue={`Inquiry: ${inquiry}${plan ? `\nPlan: ${plan}` : ""}`} required />
      </FormField>
      <Button type="submit" disabled={status === "saving"}>{status === "saving" ? "Sending..." : "Send message"}</Button>
      {status === "error" && <p role="alert">Unable to send message right now. Please retry.</p>}
    </form>
  );
}
