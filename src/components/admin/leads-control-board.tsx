"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Inquiry, Listing } from "@prisma/client";
import { InquiryStatusForm } from "@/components/admin/inquiry-status-form";

type Row = Inquiry & { listing: Pick<Listing, "title" | "slug"> | null };

const PIPELINE = ["NEW", "CONTACTED", "QUALIFIED", "VIEWING_SCHEDULED", "NEGOTIATION", "WON", "LOST", "ARCHIVED"] as const;

export function LeadsControlBoard({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("ALL");
  const [feedback, setFeedback] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });

  const filtered = useMemo(() => rows.filter((r) => status === "ALL" || r.status === status), [rows, status]);

  async function runBulk(nextStatus: string) {
    if (!selected.length) return;
    try {
      const res = await fetch("/api/admin/inquiries-bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected, status: nextStatus })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setFeedback({ type: "error", message: data?.error ?? "Bulk lead update failed." });
        return;
      }
      setFeedback({ type: "ok", message: data?.message ?? "Leads updated." });
      setSelected([]);
      router.refresh();
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Bulk lead update failed." });
    }
  }

  return (
    <>
      <div className="card-pad">
        <h3>Pipeline board</h3>
        <div className="kanban-mini">
          {PIPELINE.map((stage) => <article key={stage}><strong>{stage}</strong><p>{rows.filter((row) => row.status === stage).length}</p></article>)}
        </div>
      </div>
      <div className="card-pad">
        <div className="filter-bar">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All stages</option>
            {PIPELINE.map((stage) => <option value={stage} key={stage}>{stage}</option>)}
          </select>
          <button className="btn btn-ghost" type="button" onClick={() => runBulk("CONTACTED")}>Mark contacted</button>
          <button className="btn btn-ghost" type="button" onClick={() => runBulk("QUALIFIED")}>Mark qualified</button>
          <button className="btn btn-ghost" type="button" onClick={() => runBulk("WON")}>Mark won</button>
          <button className="btn btn-accent" type="button" onClick={() => runBulk("ARCHIVED")}>Archive selected</button>
        </div>
        {feedback.type === "ok" && <p className="form-ok">{feedback.message}</p>}
        {feedback.type === "error" && <p className="form-error">{feedback.message}</p>}
        <div className="admin-table-wrap">
          <table className="comparison-table">
            <thead><tr><th><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map((row) => row.id) : [])} /></th><th>Lead</th><th>Type</th><th>Source</th><th>Urgent</th><th>Status workflow</th></tr></thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td><input type="checkbox" checked={selected.includes(r.id)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id))} /></td>
                  <td><strong>{r.fullName}</strong><br />{r.email}</td>
                  <td>{r.inquiryType}</td>
                  <td>{r.listing?.title ?? "General"}</td>
                  <td>{r.isUrgent ? "Yes" : "No"}</td>
                  <td><InquiryStatusForm id={r.id} currentStatus={r.status} notes={r.notes} assignedTo={r.assignedTo} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
