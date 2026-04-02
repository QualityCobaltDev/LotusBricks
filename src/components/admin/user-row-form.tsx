"use client";

import { useState } from "react";

type UserRowProps = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER";
  isActive: boolean;
  planTier: "TIER_1" | "TIER_2" | "TIER_3" | "CUSTOM";
};

export function UserRowForm(props: UserRowProps) {
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsSaving(true);
    setStatus({ type: "idle" });

    try {
      const payload = {
        fullName: String(formData.get("fullName") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        role: String(formData.get("role") ?? "CUSTOMER"),
        planTier: String(formData.get("planTier") ?? "TIER_1"),
        isActive: Boolean(formData.get("isActive"))
      };

      const res = await fetch(`/api/admin/users/${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setStatus({ type: "error", message: data?.error ?? "Unable to update user." });
        return;
      }

      setStatus({ type: "ok", message: data?.message ?? "User updated." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Network error." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form action={onSubmit} className="inline-admin-form">
      <input name="fullName" defaultValue={props.fullName} aria-label={`Full name for ${props.email}`} />
      <input name="phone" defaultValue={props.phone ?? ""} placeholder="Phone" aria-label={`Phone for ${props.email}`} />
      <select name="role" defaultValue={props.role} aria-label={`Role for ${props.email}`}>
        <option value="CUSTOMER">CUSTOMER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <select name="planTier" defaultValue={props.planTier} aria-label={`Plan tier for ${props.email}`}>
        <option value="TIER_1">TIER_1</option>
        <option value="TIER_2">TIER_2</option>
        <option value="TIER_3">TIER_3</option>
        <option value="CUSTOM">CUSTOM</option>
      </select>
      <label><input type="checkbox" name="isActive" defaultChecked={props.isActive} /> Active</label>
      <button className="btn btn-ghost" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save"}</button>
      {status.type === "ok" && <span className="form-ok">{status.message}</span>}
      {status.type === "error" && <span className="form-error">{status.message}</span>}
    </form>
  );
}
