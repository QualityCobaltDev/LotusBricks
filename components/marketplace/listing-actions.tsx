"use client";

import { useState } from "react";
import { SaveButton } from "@/components/marketplace/save-button";

export function ListingActions({ listingSlug }: { listingSlug: string }) {
  const [msg, setMsg] = useState<string>();

  async function schedule(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/listings/schedule-viewing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    setMsg(json.message || json.error);
  }

  async function report(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/listings/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    setMsg(json.message || json.error);
  }

  async function share() {
    const url = `${window.location.origin}/listings/${listingSlug}`;
    const supportsNativeShare = typeof navigator.share === "function";
    if (supportsNativeShare) await navigator.share({ url });
    else await navigator.clipboard.writeText(url);
    await fetch("/api/listings/share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingSlug, channel: supportsNativeShare ? "native" : "clipboard" }) });
    setMsg("Listing link shared.");
  }

  return (
    <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900">Actions</h2>
      <div className="mt-3 flex gap-2"><SaveButton listingSlug={listingSlug} /><button onClick={share} className="rounded-lg border px-3 py-2 text-sm">Share</button></div>
      <form action={schedule} className="mt-4 space-y-2 text-sm">
        <input type="hidden" name="listingSlug" value={listingSlug} />
        <h3 className="font-semibold">Schedule viewing</h3>
        <input name="fullName" required placeholder="Full name" className="w-full rounded border px-2 py-1" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded border px-2 py-1" />
        <input name="phone" required placeholder="Phone" className="w-full rounded border px-2 py-1" />
        <input name="preferredDate" type="datetime-local" required className="w-full rounded border px-2 py-1" />
        <textarea name="notes" placeholder="Notes" className="w-full rounded border px-2 py-1" />
        <button className="rounded bg-primary-600 px-3 py-1 text-white">Request viewing</button>
      </form>
      <form action={report} className="mt-4 space-y-2 text-sm">
        <input type="hidden" name="listingSlug" value={listingSlug} />
        <h3 className="font-semibold">Report listing</h3>
        <select name="reason" required className="w-full rounded border px-2 py-1"><option value="">Select reason</option><option>Fraudulent</option><option>Incorrect info</option><option>Duplicate</option><option>Offensive content</option></select>
        <textarea name="notes" placeholder="Details" className="w-full rounded border px-2 py-1" />
        <button className="rounded bg-secondary-600 px-3 py-1 text-white">Submit report</button>
      </form>
      {msg ? <p className="mt-3 text-sm text-neutral-700">{msg}</p> : null}
    </aside>
  );
}
