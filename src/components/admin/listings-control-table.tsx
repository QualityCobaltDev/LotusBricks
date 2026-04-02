"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type AdminListingRow = {
  id: string;
  slug: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  ownerName: string;
  ownerPlanTier: string | null;
  mediaCount: number;
  updatedAtIso: string;
};

export function ListingsControlTable({ rows }: { rows: AdminListingRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });

  const filtered = useMemo(
    () => rows.filter((row) => (statusFilter === "ALL" || row.status === statusFilter) && row.title.toLowerCase().includes(query.toLowerCase())),
    [rows, statusFilter, query]
  );

  async function runBulk(action: "publish" | "archive" | "delete") {
    if (!selected.length) return;
    const ok = window.confirm(`Apply ${action} to ${selected.length} listing(s)?`);
    if (!ok) return;

    try {
      const res = await fetch("/api/admin/listings-bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected, action })
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setFeedback({ type: "error", message: data?.error ?? "Bulk action failed." });
        return;
      }

      setFeedback({ type: "ok", message: data?.message ?? "Bulk action completed." });
      setSelected([]);
      router.refresh();
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Bulk action failed." });
    }
  }

  function toggle(id: string, checked: boolean) {
    setSelected((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id));
  }

  return (
    <div className="card-pad">
      <div className="filter-bar">
        <input placeholder="Search listings" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button className="btn btn-ghost" type="button" onClick={() => runBulk("publish")}>Bulk publish</button>
        <button className="btn btn-ghost" type="button" onClick={() => runBulk("archive")}>Bulk archive</button>
        <button className="btn btn-accent" type="button" onClick={() => runBulk("delete")}>Bulk delete</button>
      </div>
      {feedback.type === "ok" && <p className="form-ok">{feedback.message}</p>}
      {feedback.type === "error" && <p className="form-error">{feedback.message}</p>}

      {rows.length === 0 ? (
        <article className="empty-state" style={{ marginTop: "1rem" }}>
          <h3>No listings yet</h3>
          <p>Create your first listing to start managing publication workflows.</p>
        </article>
      ) : (
        <div className="admin-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr><th><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map((x) => x.id) : [])} /></th><th>Listing</th><th>Status</th><th>Owner</th><th>Plan</th><th>Media</th><th>Updated</th></tr>
            </thead>
            <tbody>
              {filtered.map((x) => {
                const dateLabel = Number.isNaN(Date.parse(x.updatedAtIso)) ? "Unknown" : new Date(x.updatedAtIso).toISOString().slice(0, 10);
                return (
                  <tr key={x.id}>
                    <td><input checked={selected.includes(x.id)} type="checkbox" onChange={(e) => toggle(x.id, e.target.checked)} /></td>
                    <td><strong>{x.title}</strong><br /><small>{x.slug}</small></td>
                    <td>{x.status}</td>
                    <td>{x.ownerName}</td>
                    <td>{x.ownerPlanTier ?? "N/A"}</td>
                    <td>{x.mediaCount}</td>
                    <td>{dateLabel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
