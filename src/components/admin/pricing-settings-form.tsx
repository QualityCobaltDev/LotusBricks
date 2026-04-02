"use client";

import { useState } from "react";
import type { PlanConfig } from "@/lib/plans";

export function PricingSettingsForm({ initial }: { initial: PlanConfig[] }) {
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(formData: FormData) {
    setStatus({ type: "idle" });
    setIsSaving(true);

    const payload = initial.reduce((acc, plan) => {
      const recurringRaw = String(formData.get(`${plan.key}.recurringMonthlyUsd`) ?? "").trim();
      const recurring = recurringRaw ? Number(recurringRaw) : null;
      const signup = Number(formData.get(`${plan.key}.oneTimeSignupFeeUsd`) ?? 0);

      acc[plan.key] = {
        name: String(formData.get(`${plan.key}.name`) ?? plan.name).trim(),
        recurringMonthlyUsd: Number.isFinite(recurring) ? recurring : null,
        oneTimeSignupFeeUsd: Number.isFinite(signup) ? signup : 0,
        ctaLabel: String(formData.get(`${plan.key}.ctaLabel`) ?? plan.ctaLabel).trim(),
        ctaHref: String(formData.get(`${plan.key}.ctaHref`) ?? plan.ctaHref).trim(),
        badge: String(formData.get(`${plan.key}.badge`) ?? "").trim(),
        blurb: String(formData.get(`${plan.key}.blurb`) ?? "").trim(),
        featured: Boolean(formData.get(`${plan.key}.featured`)),
        isActive: Boolean(formData.get(`${plan.key}.isActive`))
      };
      return acc;
    }, {} as Record<string, unknown>);

    try {
      const res = await fetch("/api/pricing", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setStatus({ type: "error", message: data?.error ?? "Unable to update pricing." });
        return;
      }
      setStatus({ type: "ok", message: data?.message ?? "Pricing updated." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form action={onSubmit} className="stack-form card-pad">
      <h2>Pricing tier controls</h2>
      <p className="muted">Edit prices, sign-up fees, labels, and tier visibility from one place.</p>
      {initial.map((plan) => (
        <fieldset key={plan.key} className="card">
          <legend><strong>{plan.key}</strong></legend>
          <div className="grid">
            <label>Name<input name={`${plan.key}.name`} required defaultValue={plan.name} /></label>
            <label>Base price (USD)<input name={`${plan.key}.recurringMonthlyUsd`} type="number" min={0} defaultValue={plan.recurringMonthlyUsd ?? undefined} disabled={plan.contactOnly} /></label>
            <label>Sign-up fee (USD)<input name={`${plan.key}.oneTimeSignupFeeUsd`} type="number" min={0} defaultValue={plan.oneTimeSignupFeeUsd} disabled={plan.contactOnly} /></label>
            <label>CTA label<input name={`${plan.key}.ctaLabel`} required defaultValue={plan.ctaLabel} /></label>
            <label>CTA href<input name={`${plan.key}.ctaHref`} required defaultValue={plan.ctaHref} /></label>
            <label>Badge<input name={`${plan.key}.badge`} defaultValue={plan.badge ?? ""} /></label>
            <label>Message<input name={`${plan.key}.blurb`} defaultValue={plan.blurb ?? ""} /></label>
            <label className="remember"><input type="checkbox" name={`${plan.key}.featured`} defaultChecked={plan.featured} />Featured</label>
            <label className="remember"><input type="checkbox" name={`${plan.key}.isActive`} defaultChecked={plan.isActive !== false} />Active tier</label>
          </div>
        </fieldset>
      ))}
      <button className="btn btn-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save pricing tiers"}</button>
      {status.type === "ok" && <p className="form-ok">{status.message}</p>}
      {status.type === "error" && <p className="form-error">Save failed: {status.message}</p>}
    </form>
  );
}
