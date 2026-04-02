"use client";

import { useMemo, useState } from "react";
import type { Listing, ListingMedia, User } from "@prisma/client";

type Row = Listing & { media: ListingMedia[]; owner: Pick<User, "fullName" | "planTier"> | null };

export function ListingsControlTable({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => rows.filter((row) => (statusFilter === "ALL" || row.status === statusFilter) && row.title.toLowerCase().includes(query.toLowerCase())),
    [rows, statusFilter, query]
  );

  async function runBulk(action: "publish" | "archive" | "delete") {
    if (!selected.length) return;
    const ok = window.confirm(`Apply ${action} to ${selected.length} listing(s)?`);
    if (!ok) return;

    const res = await fetch("/api/admin/listings-bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected, action })
    });

    if (res.ok) window.location.reload();
    else alert("Bulk action failed.");
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

      <div className="admin-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr><th><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map((x) => x.id) : [])} /></th><th>Listing</th><th>Status</th><th>Owner</th><th>Plan</th><th>Updated</th></tr>
          </thead>
          <tbody>
            {filtered.map((x) => (
              <tr key={x.id}>
                <td><input checked={selected.includes(x.id)} type="checkbox" onChange={(e) => toggle(x.id, e.target.checked)} /></td>
                <td><strong>{x.title}</strong><br /><small>{x.slug}</small></td>
                <td>{x.status}</td>
                <td>{x.owner?.fullName ?? "Unassigned"}</td>
                <td>{x.owner?.planTier ?? "N/A"}</td>
                <td>{new Date(x.updatedAt).toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
