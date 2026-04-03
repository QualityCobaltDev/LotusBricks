"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type BrandInitial = Record<string, string | number>;

export function BrandSettingsForm({ initial }: { initial: BrandInitial }) {
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<"none" | "logo" | "favicon">("none");
  const [headerLogoUrl, setHeaderLogoUrl] = useState(String(initial.headerLogoUrl ?? ""));
  const [faviconUrl, setFaviconUrl] = useState(String(initial.faviconUrl ?? "/favicon.ico"));
  const [assetVersion, setAssetVersion] = useState(Number(initial.assetVersion ?? 1));

  const logoPreview = useMemo(() => headerLogoUrl || "/logo.svg", [headerLogoUrl]);
  const faviconPreview = useMemo(() => faviconUrl || "/favicon.ico", [faviconUrl]);

  async function upload(kind: "logo" | "favicon", file: File) {
    const formData = new FormData();
    formData.set("kind", kind);
    formData.set("file", file);
    setIsUploading(kind);
    setStatus({ type: "idle" });

    try {
      const res = await fetch("/api/admin/assets/image", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.data?.url) {
        setStatus({ type: "error", message: data?.error ?? `Failed to upload ${kind}.` });
        return;
      }

      if (kind === "logo") setHeaderLogoUrl(data.data.url);
      if (kind === "favicon") setFaviconUrl(data.data.url);
      setAssetVersion((v) => v + 1);
      setStatus({ type: "ok", message: `${kind === "logo" ? "Header logo" : "Favicon"} uploaded. Save to apply live.` });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : `Failed to upload ${kind}.` });
    } finally {
      setIsUploading("none");
    }
  }

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
      maintenanceBanner: String(formData.get("maintenanceBanner") ?? "").trim(),
      headerLogoUrl,
      faviconUrl,
      assetVersion
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
      <h2>Site identity & branding</h2>
      <p className="muted">Manage global branding assets. Header logo appears in navigation. Favicon appears in browser tabs.</p>
      <div className="two-col">
        <article className="card-pad">
          <h3>Header logo</h3>
          <p className="muted">Recommended: transparent PNG/SVG-like ratio, ~320×96. Used in the main header on all pages.</p>
          <Image src={logoPreview} alt="Current header logo" width={220} height={72} style={{ objectFit: "contain", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 8 }} />
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) void upload("logo", file);
            }}
            disabled={isUploading !== "none"}
          />
          <div className="hero-actions">
            <button type="button" className="btn btn-ghost" onClick={() => { setHeaderLogoUrl(""); setAssetVersion((v) => v + 1); }}>
              Reset to default logo
            </button>
          </div>
        </article>

        <article className="card-pad">
          <h3>Favicon</h3>
          <p className="muted">Recommended: 32×32 or 48×48. PNG or ICO. Used in browser tab icon and bookmarks.</p>
          <Image src={faviconPreview} alt="Current favicon" width={48} height={48} style={{ borderRadius: 8 }} />
          <input
            type="file"
            accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) void upload("favicon", file);
            }}
            disabled={isUploading !== "none"}
          />
          <div className="hero-actions">
            <button type="button" className="btn btn-ghost" onClick={() => { setFaviconUrl("/favicon.ico"); setAssetVersion((v) => v + 1); }}>
              Reset to default favicon
            </button>
          </div>
        </article>
      </div>

      <h3>Brand details</h3>
      <div className="grid">
        <label>Site name<input name="siteName" required minLength={2} defaultValue={String(initial.siteName ?? "RightBricks")} /></label>
        <label>Tagline<input name="tagline" defaultValue={String(initial.tagline ?? "Verified property marketplace in Cambodia")} /></label>
        <label>Support email<input name="supportEmail" type="email" required defaultValue={String(initial.supportEmail ?? "contact@rightbricks.online")} /></label>
        <label>Display phone<input name="displayPhone" defaultValue={String(initial.displayPhone ?? "(+855) 011 389 625")} /></label>
        <label>Click-to-call link<input name="phoneLink" defaultValue={String(initial.phoneLink ?? "tel:+85511389625")} /></label>
        <label>WhatsApp link<input name="whatsappLink" defaultValue={String(initial.whatsappLink ?? "https://wa.me/85511389625")} /></label>
        <label>Telegram link<input name="telegramLink" defaultValue={String(initial.telegramLink ?? "https://t.me/")} /></label>
        <label>Support hours<input name="supportHours" defaultValue={String(initial.supportHours ?? "Mon-Sat 8:00-20:00 ICT")} /></label>
      </div>
      <label>Address<textarea name="address" defaultValue={String(initial.address ?? "Phnom Penh, Cambodia")} /></label>
      <label>Maintenance / announcement bar<textarea name="maintenanceBanner" defaultValue={String(initial.maintenanceBanner ?? "")} /></label>

      <article className="card-pad">
        <h3>Future-ready placeholders</h3>
        <ul className="muted">
          <li>Footer logo (planned)</li>
          <li>Social share image (planned)</li>
          <li>SEO site image (planned)</li>
          <li>Dark mode logo variant (planned)</li>
        </ul>
      </article>

      <button className="btn btn-primary" type="submit" disabled={isSaving || isUploading !== "none"}>
        {isSaving ? "Saving…" : "Save site identity"}
      </button>
      {isUploading !== "none" && <p className="muted">Uploading {isUploading}…</p>}
      {status.type === "ok" && <p className="form-ok">{status.message}</p>}
      {status.type === "error" && <p className="form-error">Save failed: {status.message}</p>}
    </form>
  );
}
