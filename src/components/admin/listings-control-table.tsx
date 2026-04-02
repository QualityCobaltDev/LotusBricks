"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export type AdminListingRow = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  city?: string;
  district?: string;
  listingType?: "SALE" | "RENT" | "COMMERCIAL" | "LAND" | "LUXURY" | "INVESTMENT";
  category?: "VILLA" | "CONDO" | "APARTMENT" | "TOWNHOUSE" | "PENTHOUSE" | "OFFICE" | "SHOPHOUSE" | "LAND" | "WAREHOUSE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  currency?: string;
  priceUsd?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  featured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ownerName: string;
  ownerPlanTier: string | null;
  mediaCount: number;
  mediaUrls?: string[];
  videoUrls?: string[];
  updatedAtIso: string;
};

type EditorState = {
  mode: "create" | "edit";
  listingId?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  city: string;
  district: string;
  listingType: "SALE" | "RENT" | "COMMERCIAL" | "LAND" | "LUXURY" | "INVESTMENT";
  category: "VILLA" | "CONDO" | "APARTMENT" | "TOWNHOUSE" | "PENTHOUSE" | "OFFICE" | "SHOPHOUSE" | "LAND" | "WAREHOUSE";
  priceUsd: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  imageUrls: string;
  videoUrls: string;
  contactPhone: string;
  contactEmail: string;
  internalNotes: string;
};

const defaultEditor = (): EditorState => ({
  mode: "create",
  title: "",
  slug: "",
  summary: "",
  description: "",
  city: "Phnom Penh",
  district: "Chamkarmon",
  listingType: "SALE",
  category: "CONDO",
  priceUsd: 100000,
  currency: "USD",
  bedrooms: 1,
  bathrooms: 1,
  areaSqm: 50,
  status: "DRAFT",
  featured: false,
  seoTitle: "",
  seoDescription: "",
  imageUrls: "",
  videoUrls: "",
  contactPhone: "",
  contactEmail: "",
  internalNotes: ""
});

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export function ListingsControlTable({ rows }: { rows: AdminListingRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"latest" | "status" | "price">("latest");
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [feedback, setFeedback] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(() => {
    const base = rows.filter(
      (row) =>
        (statusFilter === "ALL" || row.status === statusFilter) &&
        `${row.title} ${row.slug} ${row.city ?? ""} ${row.district ?? ""}`.toLowerCase().includes(query.toLowerCase())
    );

    return base.sort((a, b) => {
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "price") return (b.priceUsd ?? 0) - (a.priceUsd ?? 0);
      return Date.parse(b.updatedAtIso) - Date.parse(a.updatedAtIso);
    });
  }, [rows, statusFilter, query, sortBy]);

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
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  function openCreate() {
    setEditor(defaultEditor());
    setFeedback({ type: "idle" });
  }

  function openEdit(row: AdminListingRow) {
    setEditor({
      ...defaultEditor(),
      mode: "edit",
      listingId: row.id,
      title: row.title,
      slug: row.slug,
      summary: row.summary ?? "",
      description: row.description ?? "",
      city: row.city ?? "Phnom Penh",
      district: row.district ?? "Chamkarmon",
      listingType: row.listingType ?? "SALE",
      category: row.category ?? "CONDO",
      priceUsd: row.priceUsd ?? 100000,
      currency: row.currency ?? "USD",
      bedrooms: row.bedrooms ?? 1,
      bathrooms: row.bathrooms ?? 1,
      areaSqm: row.areaSqm ?? 50,
      status: row.status,
      featured: Boolean(row.featured),
      seoTitle: row.seoTitle ?? "",
      seoDescription: row.seoDescription ?? "",
      imageUrls: (row.mediaUrls ?? []).join("\n"),
      videoUrls: (row.videoUrls ?? []).join("\n")
    });
    setFeedback({ type: "idle" });
  }

  async function saveListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;

    const payload = {
      slug: toSlug(editor.slug || editor.title),
      title: editor.title,
      summary: editor.summary,
      description: editor.description,
      city: editor.city,
      district: editor.district,
      priceUsd: Number(editor.priceUsd),
      bedrooms: Number(editor.bedrooms),
      bathrooms: Number(editor.bathrooms),
      areaSqm: Number(editor.areaSqm),
      listingType: editor.listingType,
      category: editor.category,
      availability: "AVAILABLE",
      country: "Cambodia",
      currency: editor.currency,
      status: editor.status,
      featured: editor.featured,
      seoTitle: editor.seoTitle || editor.title,
      seoDescription: editor.seoDescription || editor.summary,
      imageUrls: editor.imageUrls.split("\n").map((x) => x.trim()).filter(Boolean),
      videoUrls: editor.videoUrls.split("\n").map((x) => x.trim()).filter(Boolean),
      contactPhone: editor.contactPhone || undefined,
      contactEmail: editor.contactEmail || undefined,
      notes: editor.internalNotes || undefined
    };

    setIsSaving(true);
    setFeedback({ type: "idle" });

    try {
      const endpoint = editor.mode === "create" ? "/api/admin/listings" : `/api/admin/listings/${editor.listingId}`;
      const method = editor.mode === "create" ? "POST" : "PUT";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setFeedback({ type: "error", message: data?.error ?? "Save failed." });
        return;
      }

      setFeedback({ type: "ok", message: data?.message ?? "Saved." });
      setEditor(null);
      router.refresh();
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Save failed." });
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteListing(row: AdminListingRow) {
    const ok = window.confirm(`Delete \"${row.title}\" permanently?`);
    if (!ok) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/listings/${row.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setFeedback({ type: "error", message: data?.error ?? "Delete failed." });
        return;
      }
      setFeedback({ type: "ok", message: data?.message ?? "Listing deleted." });
      router.refresh();
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Delete failed." });
    } finally {
      setIsSaving(false);
    }
  }

  async function setStatus(id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setFeedback({ type: "error", message: data?.error ?? "Status update failed." });
        return;
      }
      setFeedback({ type: "ok", message: data?.message ?? "Status updated." });
      router.refresh();
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Status update failed." });
    } finally {
      setIsSaving(false);
    }
  }

  async function duplicateListing(row: AdminListingRow) {
    const payload = {
      slug: `${row.slug}-${Date.now()}`,
      title: `${row.title} (Copy)`,
      summary: row.summary ?? "Premium property listing summary.",
      description: row.description ?? "Premium property listing description with key details.",
      city: row.city ?? "Phnom Penh",
      district: row.district ?? "Chamkarmon",
      priceUsd: row.priceUsd ?? 100000,
      bedrooms: row.bedrooms ?? 1,
      bathrooms: row.bathrooms ?? 1,
      areaSqm: row.areaSqm ?? 50,
      listingType: row.listingType ?? "SALE",
      category: row.category ?? "CONDO",
      availability: "AVAILABLE",
      country: "Cambodia",
      currency: row.currency ?? "USD",
      status: "DRAFT",
      featured: false,
      seoTitle: row.seoTitle ?? `${row.title} copy`,
      seoDescription: row.seoDescription ?? row.summary ?? "",
      imageUrls: row.mediaUrls ?? [],
      videoUrls: row.videoUrls ?? []
    };

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setFeedback({ type: "error", message: data?.error ?? "Duplicate failed." });
        return;
      }
      setFeedback({ type: "ok", message: "Listing duplicated to draft." });
      router.refresh();
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Duplicate failed." });
    } finally {
      setIsSaving(false);
    }
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
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "latest" | "status" | "price")}>
          <option value="latest">Sort: latest</option>
          <option value="status">Sort: status</option>
          <option value="price">Sort: price</option>
        </select>
        <button className="btn btn-primary" type="button" onClick={openCreate}>Create listing</button>
        <button className="btn btn-ghost" type="button" onClick={() => runBulk("publish")} disabled={isSaving}>Bulk publish</button>
        <button className="btn btn-ghost" type="button" onClick={() => runBulk("archive")} disabled={isSaving}>Bulk archive</button>
        <button className="btn btn-accent" type="button" onClick={() => runBulk("delete")} disabled={isSaving}>Bulk delete</button>
      </div>
      {feedback.type === "ok" && <p className="form-ok">{feedback.message}</p>}
      {feedback.type === "error" && <p className="form-error">{feedback.message}</p>}

      {rows.length === 0 ? (
        <article className="empty-state" style={{ marginTop: "1rem" }}>
          <h3>No listings yet</h3>
          <p>Create your first listing to start managing publication workflows.</p>
          <button className="btn btn-primary" type="button" onClick={openCreate}>Create first listing</button>
        </article>
      ) : (
        <div className="admin-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr><th><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map((x) => x.id) : [])} /></th><th>Listing</th><th>Status</th><th>Owner</th><th>Plan</th><th>Media</th><th>Price</th><th>Updated</th><th>Actions</th></tr>
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
                    <td>{x.priceUsd ? `$${x.priceUsd.toLocaleString()}` : "-"}</td>
                    <td>{dateLabel}</td>
                    <td>
                      <div style={{ display: "grid", gap: 4 }}>
                        <button className="btn btn-ghost" type="button" onClick={() => openEdit(x)}>Edit</button>
                        <button className="btn btn-ghost" type="button" onClick={() => setStatus(x.id, "PUBLISHED")} disabled={isSaving}>Publish</button>
                        <button className="btn btn-ghost" type="button" onClick={() => setStatus(x.id, "DRAFT")} disabled={isSaving}>Unpublish</button>
                        <button className="btn btn-ghost" type="button" onClick={() => setStatus(x.id, "ARCHIVED")} disabled={isSaving}>Archive</button>
                        <button className="btn btn-ghost" type="button" onClick={() => duplicateListing(x)} disabled={isSaving}>Duplicate</button>
                        <a className="btn btn-ghost" href={`/listings/${x.slug}`} target="_blank" rel="noreferrer">Preview</a>
                        <button className="btn btn-accent" type="button" onClick={() => deleteListing(x)} disabled={isSaving}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editor && (
        <form onSubmit={saveListing} className="stack-form card-pad" style={{ marginTop: "1rem" }}>
          <h3>{editor.mode === "create" ? "Create Listing" : "Edit Listing"}</h3>
          <div className="grid">
            <label>Title<input value={editor.title} onChange={(e) => setEditor((prev) => prev ? { ...prev, title: e.target.value } : null)} required /></label>
            <label>Slug<input value={editor.slug} onChange={(e) => setEditor((prev) => prev ? { ...prev, slug: toSlug(e.target.value) } : null)} required /></label>
            <label>Summary<input value={editor.summary} onChange={(e) => setEditor((prev) => prev ? { ...prev, summary: e.target.value } : null)} required /></label>
            <label>Description<textarea value={editor.description} onChange={(e) => setEditor((prev) => prev ? { ...prev, description: e.target.value } : null)} required /></label>
            <label>City<input value={editor.city} onChange={(e) => setEditor((prev) => prev ? { ...prev, city: e.target.value } : null)} required /></label>
            <label>District<input value={editor.district} onChange={(e) => setEditor((prev) => prev ? { ...prev, district: e.target.value } : null)} required /></label>
            <label>Listing Type<select value={editor.listingType} onChange={(e) => setEditor((prev) => prev ? { ...prev, listingType: e.target.value as EditorState["listingType"] } : null)}><option value="SALE">Sale</option><option value="RENT">Rent</option><option value="COMMERCIAL">Commercial</option><option value="LAND">Land</option><option value="LUXURY">Luxury</option><option value="INVESTMENT">Investment</option></select></label>
            <label>Category<select value={editor.category} onChange={(e) => setEditor((prev) => prev ? { ...prev, category: e.target.value as EditorState["category"] } : null)}><option value="CONDO">Condo</option><option value="APARTMENT">Apartment</option><option value="VILLA">Villa</option><option value="TOWNHOUSE">Townhouse</option><option value="PENTHOUSE">Penthouse</option><option value="OFFICE">Office</option><option value="SHOPHOUSE">Shophouse</option><option value="LAND">Land</option><option value="WAREHOUSE">Warehouse</option></select></label>
            <label>Price<input type="number" value={editor.priceUsd} onChange={(e) => setEditor((prev) => prev ? { ...prev, priceUsd: Number(e.target.value) } : null)} required /></label>
            <label>Currency<input value={editor.currency} onChange={(e) => setEditor((prev) => prev ? { ...prev, currency: e.target.value } : null)} required /></label>
            <label>Bedrooms<input type="number" value={editor.bedrooms} onChange={(e) => setEditor((prev) => prev ? { ...prev, bedrooms: Number(e.target.value) } : null)} required /></label>
            <label>Bathrooms<input type="number" value={editor.bathrooms} onChange={(e) => setEditor((prev) => prev ? { ...prev, bathrooms: Number(e.target.value) } : null)} required /></label>
            <label>Area sqm<input type="number" value={editor.areaSqm} onChange={(e) => setEditor((prev) => prev ? { ...prev, areaSqm: Number(e.target.value) } : null)} required /></label>
            <label>Status<select value={editor.status} onChange={(e) => setEditor((prev) => prev ? { ...prev, status: e.target.value as EditorState["status"] } : null)}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
            <label>SEO title<input value={editor.seoTitle} onChange={(e) => setEditor((prev) => prev ? { ...prev, seoTitle: e.target.value } : null)} /></label>
            <label>SEO description<textarea value={editor.seoDescription} onChange={(e) => setEditor((prev) => prev ? { ...prev, seoDescription: e.target.value } : null)} /></label>
            <label>Cover/gallery image URLs (one per line)<textarea value={editor.imageUrls} onChange={(e) => setEditor((prev) => prev ? { ...prev, imageUrls: e.target.value } : null)} /></label>
            <label>Video URLs (one per line)<textarea value={editor.videoUrls} onChange={(e) => setEditor((prev) => prev ? { ...prev, videoUrls: e.target.value } : null)} /></label>
            <label>Contact phone<input value={editor.contactPhone} onChange={(e) => setEditor((prev) => prev ? { ...prev, contactPhone: e.target.value } : null)} /></label>
            <label>Contact email<input value={editor.contactEmail} onChange={(e) => setEditor((prev) => prev ? { ...prev, contactEmail: e.target.value } : null)} /></label>
            <label>Internal notes<textarea value={editor.internalNotes} onChange={(e) => setEditor((prev) => prev ? { ...prev, internalNotes: e.target.value } : null)} /></label>
            <label className="remember"><input type="checkbox" checked={editor.featured} onChange={(e) => setEditor((prev) => prev ? { ...prev, featured: e.target.checked } : null)} /> Featured</label>
          </div>
          <div className="hero-actions">
            <button className="btn btn-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : editor.mode === "create" ? "Create listing" : "Save listing"}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditor(null)} disabled={isSaving}>Cancel</button>
            <a className="btn btn-ghost" href={`/listings/${editor.slug || ""}`} target="_blank" rel="noreferrer">Preview</a>
          </div>
        </form>
      )}
    </div>
  );
}
