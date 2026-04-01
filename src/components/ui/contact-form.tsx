"use client";

import { useState } from "react";

export function ContactForm({ listingId }: { listingId: string }) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function onSubmit(formData: FormData) {
    setStatus("idle");
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
    setStatus(res.ok ? "ok" : "error");
  }

  return (
    <form action={onSubmit} className="stack-form">
      <label>Full name<input name="fullName" required /></label>
      <label>Email<input name="email" type="email" required /></label>
      <label>Phone<input name="phone" /></label>
      <label>How can we help?<textarea name="message" required minLength={10} /></label>
      <button className="btn btn-primary">Send message</button>
      {status === "ok" && <p className="form-ok">Thanks. A property specialist will contact you shortly.</p>}
      {status === "error" && <p className="form-error">Submission failed. Please retry.</p>}
    </form>
  );
}
