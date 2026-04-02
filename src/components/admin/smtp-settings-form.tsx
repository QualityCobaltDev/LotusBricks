"use client";

import { useState } from "react";

type SmtpInitial = {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from?: string;
};

export function SmtpSettingsForm({ initial }: { initial: SmtpInitial }) {
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [testStatus, setTestStatus] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  async function onSave(formData: FormData) {
    setStatus({ type: "idle" });
    setIsSaving(true);

    const payload = {
      host: String(formData.get("host") ?? "").trim(),
      port: Number(formData.get("port") ?? 465),
      user: String(formData.get("user") ?? "").trim(),
      pass: String(formData.get("pass") ?? "").trim(),
      from: String(formData.get("from") ?? "").trim()
    };

    try {
      const res = await fetch("/api/admin/smtp-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setStatus({ type: "error", message: data?.error ?? "Failed to save SMTP settings." });
        return;
      }
      setStatus({ type: "ok", message: data?.message ?? "SMTP settings saved." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setIsSaving(false);
    }
  }

  async function sendTestEmail() {
    setTestStatus({ type: "idle" });
    setIsTesting(true);

    try {
      const res = await fetch("/api/admin/test-email", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setTestStatus({ type: "error", message: data?.error ?? "SMTP test failed." });
        return;
      }
      setTestStatus({ type: "ok", message: "SMTP test email request sent." });
    } catch (error) {
      setTestStatus({ type: "error", message: error instanceof Error ? error.message : "SMTP test failed." });
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <form action={onSave} className="stack-form card-pad">
      <h2>SMTP settings</h2>
      <div className="grid">
        <label>SMTP host<input name="host" required defaultValue={initial.host ?? ""} /></label>
        <label>SMTP port<input name="port" type="number" min={1} required defaultValue={initial.port ?? 465} /></label>
        <label>SMTP user<input name="user" required defaultValue={initial.user ?? ""} /></label>
        <label>SMTP password<input name="pass" type="password" required defaultValue={initial.pass ?? ""} /></label>
        <label>From email<input name="from" required defaultValue={initial.from ?? initial.user ?? ""} /></label>
      </div>
      <div className="hero-actions">
        <button className="btn btn-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save SMTP settings"}</button>
        <button className="btn btn-ghost" type="button" onClick={sendTestEmail} disabled={isTesting}>{isTesting ? "Sending…" : "Send SMTP test email"}</button>
      </div>
      {status.type === "ok" && <p className="form-ok">{status.message}</p>}
      {status.type === "error" && <p className="form-error">Save failed: {status.message}</p>}
      {testStatus.type === "ok" && <p className="form-ok">{testStatus.message}</p>}
      {testStatus.type === "error" && <p className="form-error">Test failed: {testStatus.message}</p>}
    </form>
  );
}
