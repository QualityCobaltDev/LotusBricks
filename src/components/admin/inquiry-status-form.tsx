"use client";

import { useState } from "react";

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "VIEWING_SCHEDULED", "NEGOTIATION", "WON", "LOST", "ARCHIVED"] as const;

export function InquiryStatusForm({ id, currentStatus, notes, assignedTo }: { id: string; currentStatus: string; notes: string | null; assignedTo: string | null }) {
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");

  async function update(formData: FormData) {
    setState("idle");
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: String(formData.get("status")),
        notes: String(formData.get("notes") ?? ""),
        assignedTo: String(formData.get("assignedTo") ?? "")
      })
    });
    setState(res.ok ? "ok" : "error");
  }

  return (
    <form action={update} className="inline-admin-form">
      <select name="status" defaultValue={currentStatus}>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <input name="assignedTo" defaultValue={assignedTo ?? ""} placeholder="Assignee" />
      <input name="notes" defaultValue={notes ?? ""} placeholder="Notes" />
      <button className="btn btn-ghost" type="submit">Update</button>
      {state === "ok" && <span className="form-ok">Saved</span>}
      {state === "error" && <span className="form-error">Error</span>}
    </form>
  );
}
