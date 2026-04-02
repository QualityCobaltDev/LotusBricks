"use client";

import { useState } from "react";

export function BrandSettingsForm({ initial }: { initial: Record<string, string> }) {
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);

  async function submit(formData: FormData) {
    setStatus({ type: "idle" });
    setIsSaving(true);

    const payload = {
      siteName: String(formData.get("siteName") ?? "RightBricks").trim(),
      tagline: String(formData.get("tagline") ?? "").trim(),
      supportEmail: String(formData.get("supportEmail") ?? "contact@rightbricks.online").trim(),
      displayPhone: String(formData.get("displayPhone") ?? "(+855) 011 389 625").trim(),
      phoneLink: String(formData.get("phoneLink") ?? "tel:+85511389625").trim(),
      whatsappLink: String(formData.get("whatsappLink") ?? "https://wa.me/85511389625").trim(),
      telegramLink: String(formData.get("telegramLink") ?? "https://t.me/").trim(),
      supportHours: String(formData.get("supportHours") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      maintenanceBanner: String(formData.get("maintenanceBanner") ?? "").trim()
    };

    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setStatus({ type: "error", message: data?.error ?? "Failed to save." });
        return;
      }
      setStatus({ type: "ok", message: data?.message ?? "Saved." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form action={submit} className="stack-form card-pad">
      <h2>Brand & global settings</h2>
      <div className="grid">
        <label>Site name<input name="siteName" required minLength={2} defaultValue={initial.siteName ?? "RightBricks"} /></label>
        <label>Tagline<input name="tagline" defaultValue={initial.tagline ?? "Verified property marketplace in Cambodia"} /></label>
        <label>Support email<input name="supportEmail" type="email" required defaultValue={initial.supportEmail ?? "contact@rightbricks.online"} /></label>
        <label>Display phone<input name="displayPhone" defaultValue={initial.displayPhone ?? "(+855) 011 389 625"} /></label>
        <label>Click-to-call link<input name="phoneLink" defaultValue={initial.phoneLink ?? "tel:+85511389625"} /></label>
        <label>WhatsApp link<input name="whatsappLink" defaultValue={initial.whatsappLink ?? "https://wa.me/85511389625"} /></label>
        <label>Telegram link<input name="telegramLink" defaultValue={initial.telegramLink ?? "https://t.me/"} /></label>
        <label>Support hours<input name="supportHours" defaultValue={initial.supportHours ?? "Mon-Sat 8:00-20:00 ICT"} /></label>
      </div>
      <label>Address<textarea name="address" defaultValue={initial.address ?? "Phnom Penh, Cambodia"} /></label>
      <label>Maintenance / announcement bar<textarea name="maintenanceBanner" defaultValue={initial.maintenanceBanner ?? ""} /></label>
      <button className="btn btn-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save global settings"}</button>
      {status.type === "ok" && <p className="form-ok">{status.message}</p>}
      {status.type === "error" && <p className="form-error">Save failed: {status.message}</p>}
    </form>
  );
}
