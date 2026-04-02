"use client";

import { useState } from "react";

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "VIEWING_SCHEDULED", "NEGOTIATION", "WON", "LOST", "ARCHIVED"] as const;

export function InquiryStatusForm({ id, currentStatus, notes, assignedTo }: { id: string; currentStatus: string; notes: string | null; assignedTo: string | null }) {
  const [state, setState] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);

  async function update(formData: FormData) {
    setState({ type: "idle" });
    setIsSaving(true);

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: String(formData.get("status")),
          notes: String(formData.get("notes") ?? "").trim(),
          assignedTo: String(formData.get("assignedTo") ?? "").trim()
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setState({ type: "error", message: data?.error ?? "Update failed." });
        return;
      }
      setState({ type: "ok", message: data?.message ?? "Saved" });
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form action={update} className="inline-admin-form">
      <select name="status" defaultValue={currentStatus}>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <input name="assignedTo" defaultValue={assignedTo ?? ""} placeholder="Assignee" />
      <input name="notes" defaultValue={notes ?? ""} placeholder="Notes" />
      <button className="btn btn-ghost" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Update"}</button>
      {state.type === "ok" && <span className="form-ok">{state.message}</span>}
      {state.type === "error" && <span className="form-error">{state.message}</span>}
    </form>
  );
}
