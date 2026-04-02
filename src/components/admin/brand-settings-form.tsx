"use client";

import { useState } from "react";

export function BrandSettingsForm({ initial }: { initial: Record<string, string> }) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("idle");
    const payload = {
      siteName: String(formData.get("siteName") ?? "RightBricks"),
      tagline: String(formData.get("tagline") ?? ""),
      supportEmail: String(formData.get("supportEmail") ?? "contact@rightbricks.online"),
      displayPhone: String(formData.get("displayPhone") ?? "(+855) 011 389 625"),
      phoneLink: String(formData.get("phoneLink") ?? "tel:+85511389625"),
      whatsappLink: String(formData.get("whatsappLink") ?? "https://wa.me/85511389625"),
      telegramLink: String(formData.get("telegramLink") ?? "https://t.me/"),
      supportHours: String(formData.get("supportHours") ?? ""),
      address: String(formData.get("address") ?? ""),
      maintenanceBanner: String(formData.get("maintenanceBanner") ?? "")
    };

    const res = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setStatus(res.ok ? "ok" : "error");
  }

  return (
    <form action={submit} className="stack-form card-pad">
      <h2>Brand & global settings</h2>
      <div className="grid">
        <label>Site name<input name="siteName" defaultValue={initial.siteName ?? "RightBricks"} /></label>
        <label>Tagline<input name="tagline" defaultValue={initial.tagline ?? "Verified property marketplace in Cambodia"} /></label>
        <label>Support email<input name="supportEmail" defaultValue={initial.supportEmail ?? "contact@rightbricks.online"} /></label>
        <label>Display phone<input name="displayPhone" defaultValue={initial.displayPhone ?? "(+855) 011 389 625"} /></label>
        <label>Click-to-call link<input name="phoneLink" defaultValue={initial.phoneLink ?? "tel:+85511389625"} /></label>
        <label>WhatsApp link<input name="whatsappLink" defaultValue={initial.whatsappLink ?? "https://wa.me/85511389625"} /></label>
        <label>Telegram link<input name="telegramLink" defaultValue={initial.telegramLink ?? "https://t.me/"} /></label>
        <label>Support hours<input name="supportHours" defaultValue={initial.supportHours ?? "Mon-Sat 8:00-20:00 ICT"} /></label>
      </div>
      <label>Address<textarea name="address" defaultValue={initial.address ?? "Phnom Penh, Cambodia"} /></label>
      <label>Maintenance / announcement bar<textarea name="maintenanceBanner" defaultValue={initial.maintenanceBanner ?? ""} /></label>
      <button className="btn btn-primary" type="submit">Save global settings</button>
      {status === "ok" && <p className="form-ok">Saved.</p>}
      {status === "error" && <p className="form-error">Failed to save.</p>}
    </form>
  );
}
