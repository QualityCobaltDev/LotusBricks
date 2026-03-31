"use client";

import { useState } from "react";

export function ContactForm() {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function submit(formData: FormData) {
    setMessage("");
    setError("");
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    if (!res.ok) return setError(json.error || "Failed to send");
    setMessage(json.message);
  }

  return (
    <form action={submit} className="grid gap-3 md:grid-cols-2">
      <input required name="name" placeholder="Full name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <input required type="email" name="email" placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <input name="phone" placeholder="Phone" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <input required name="subject" placeholder="Subject" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <textarea required name="message" rows={4} placeholder="Message" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
      <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white md:col-span-2">Send message</button>
      {message ? <p className="text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
      {error ? <p className="text-sm text-rose-700 md:col-span-2">{error}</p> : null}
    </form>
  );
}
