"use client";

import { useState } from "react";

export function InquiryForm({ listingId, compact = false }: { listingId: string; compact?: boolean }) {
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");

  async function submit(formData: FormData) {
    setState("idle");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        fullName: String(formData.get("fullName")),
        email: String(formData.get("email")),
        phone: String(formData.get("phone") ?? ""),
        message: String(formData.get("message"))
      })
    });
    setState(res.ok ? "ok" : "error");
  }

  return (
    <form action={submit} className={compact ? "compact-form" : "stack-form"}>
      <input name="fullName" placeholder="Full name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone (optional)" />
      <textarea name="message" placeholder="Tell us your timeline, budget, and goals." required minLength={10} />
      <button className="btn btn-primary">Send inquiry</button>
      {state === "ok" && <p className="form-ok">Inquiry sent. Our team typically responds within 2 hours.</p>}
      {state === "error" && <p className="form-error">Unable to submit right now. Please try again.</p>}
    </form>
  );
}
