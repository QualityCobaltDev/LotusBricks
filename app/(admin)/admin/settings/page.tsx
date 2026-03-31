"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { formatRecurring, formatUsd, publicPlans } from "@/lib/plans";

export default function AdminSettingsPage() {
  const [recipient, setRecipient] = useState<string>(siteConfig.contactEmail);
  const [result, setResult] = useState("");

  async function sendTestEmail() {
    const res = await fetch("/api/admin/email/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipient }) });
    const json = await res.json();
    setResult(json.ok ? "Test email sent successfully." : `Failed: ${json.error}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Contact, Email & Plan Settings</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm"><p><strong>Phone:</strong> {siteConfig.contactPhoneDisplay}</p><p><strong>Email:</strong> {siteConfig.contactEmail}</p><p className="mt-2 text-neutral-600">Managed globally across header, footer, listing pages, help, and legal pages.</p></div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4"><h2 className="font-semibold">SMTP Health Check</h2><p className="mt-2 text-sm text-neutral-600">Host: mail.spacemail.com · Port: 465/587 · Secure SSL</p><div className="mt-3 flex gap-2"><input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm" /><button onClick={sendTestEmail} className="rounded-lg bg-primary-600 px-3 py-2 text-sm text-white">Send test</button></div>{result ? <p className="mt-2 text-sm">{result}</p> : null}</div>
      </div>

      <div className="mt-5 rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Public Plan Configuration</h2>
        <p className="mt-1 text-sm text-neutral-600">One-time signup fee is charged only for new standard subscriptions; not charged on renewals.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-left"><tr><th className="p-2">Plan</th><th className="p-2">Recurring</th><th className="p-2">Signup Fee</th><th className="p-2">Listing Cap</th><th className="p-2">Media Cap</th><th className="p-2">Contact-only</th></tr></thead>
            <tbody>
              {publicPlans.map((plan) => (
                <tr key={plan.key} className="border-t">
                  <td className="p-2">{plan.name}</td>
                  <td className="p-2">{formatRecurring(plan)}</td>
                  <td className="p-2">{plan.isContactOnly ? "N/A" : formatUsd(plan.oneTimeSignupFeeUsd)}</td>
                  <td className="p-2">{plan.listingLimit ?? "10+"}</td>
                  <td className="p-2">{plan.photosPerListing} photos / {plan.videosPerListing} videos</td>
                  <td className="p-2">{plan.isContactOnly ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
