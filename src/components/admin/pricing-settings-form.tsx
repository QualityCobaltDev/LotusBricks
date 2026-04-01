"use client";

import { useState } from "react";
import type { PlanConfig } from "@/lib/plans";

export function PricingSettingsForm({ initial }: { initial: PlanConfig[] }) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function onSubmit(formData: FormData) {
    setStatus("idle");

    const payload = initial.reduce((acc, plan) => {
      const recurringRaw = String(formData.get(`${plan.key}.recurringMonthlyUsd`) ?? "");
      acc[plan.key] = {
        name: String(formData.get(`${plan.key}.name`) ?? plan.name),
        recurringMonthlyUsd: recurringRaw ? Number(recurringRaw) : null,
        oneTimeSignupFeeUsd: Number(formData.get(`${plan.key}.oneTimeSignupFeeUsd`) ?? 0),
        ctaLabel: String(formData.get(`${plan.key}.ctaLabel`) ?? plan.ctaLabel),
        ctaHref: String(formData.get(`${plan.key}.ctaHref`) ?? plan.ctaHref),
        badge: String(formData.get(`${plan.key}.badge`) ?? "") || undefined,
        blurb: String(formData.get(`${plan.key}.blurb`) ?? "") || undefined,
        featured: Boolean(formData.get(`${plan.key}.featured`)),
        isActive: Boolean(formData.get(`${plan.key}.isActive`))
      };
      return acc;
    }, {} as Record<string, unknown>);

    const res = await fetch("/api/pricing", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setStatus(res.ok ? "ok" : "error");
  }

  return (
    <form action={onSubmit} className="stack-form card-pad">
      <h2>Pricing tier controls</h2>
      <p className="muted">Edit prices, sign-up fees, labels, and tier visibility from one place.</p>
      {initial.map((plan) => (
        <fieldset key={plan.key} className="card">
          <legend><strong>{plan.key}</strong></legend>
          <div className="grid">
            <label>Name<input name={`${plan.key}.name`} defaultValue={plan.name} /></label>
            <label>Base price (USD)<input name={`${plan.key}.recurringMonthlyUsd`} type="number" min={0} defaultValue={plan.recurringMonthlyUsd ?? undefined} disabled={plan.contactOnly} /></label>
            <label>Sign-up fee (USD)<input name={`${plan.key}.oneTimeSignupFeeUsd`} type="number" min={0} defaultValue={plan.oneTimeSignupFeeUsd} disabled={plan.contactOnly} /></label>
            <label>CTA label<input name={`${plan.key}.ctaLabel`} defaultValue={plan.ctaLabel} /></label>
            <label>CTA href<input name={`${plan.key}.ctaHref`} defaultValue={plan.ctaHref} /></label>
            <label>Badge<input name={`${plan.key}.badge`} defaultValue={plan.badge ?? ""} /></label>
            <label>Message<input name={`${plan.key}.blurb`} defaultValue={plan.blurb ?? ""} /></label>
            <label className="remember"><input type="checkbox" name={`${plan.key}.featured`} defaultChecked={plan.featured} />Featured</label>
            <label className="remember"><input type="checkbox" name={`${plan.key}.isActive`} defaultChecked={plan.isActive !== false} />Active tier</label>
          </div>
        </fieldset>
      ))}
      <button className="btn btn-primary" type="submit">Save pricing tiers</button>
      {status === "ok" && <p className="form-ok">Pricing updated.</p>}
      {status === "error" && <p className="form-error">Unable to update pricing.</p>}
    </form>
  );
}
