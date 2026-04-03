"use client";

import Image from "next/image";
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
  listingIntent?: "SALE" | "RENT" | "INVESTMENT" | "LEASE";
  category?: "VILLA" | "CONDO" | "APARTMENT" | "TOWNHOUSE" | "PENTHOUSE" | "OFFICE" | "SHOPHOUSE" | "LAND" | "WAREHOUSE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  currency?: string;
  priceUsd?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  featured?: boolean;
  verificationState?: "UNVERIFIED" | "IN_REVIEW" | "VERIFIED";
  readinessScore?: number;
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
  listingIntent: "SALE" | "RENT" | "INVESTMENT" | "LEASE";
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
  listingImages: string[];
  primaryImageIndex: number;
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const defaultEditor = (): EditorState => ({
  mode: "create",
  title: "",
  slug: "",
  summary: "",
  description: "",
  city: "Phnom Penh",
  district: "Chamkarmon",
  listingType: "SALE",
  listingIntent: "SALE",
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
  listingImages: [],
  primaryImageIndex: 0
});

export function ListingsControlTable({ rows }: { rows: AdminListingRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [feedback, setFeedback] = useState<{ type: "idle" | "ok" | "error"; message?: string; fieldErrors?: Record<string, string[]> }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (statusFilter === "ALL" || row.status === statusFilter) &&
          `${row.title} ${row.slug} ${row.city ?? ""} ${row.district ?? ""}`.toLowerCase().includes(query.toLowerCase())
      ),
    [rows, query, statusFilter]
  );

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
      listingIntent: row.listingIntent ?? "SALE",
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
      listingImages: row.mediaUrls ?? [],
      primaryImageIndex: 0
    });
  }

  async function uploadListingImages(files: FileList | null) {
    if (!files?.length || !editor) return;
    setIsUploading(true);
    setFeedback({ type: "idle" });

    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.set("kind", "listing");
        form.set("file", file);
        const res = await fetch("/api/admin/assets/image", { method: "POST", body: form });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok || !data?.data?.url) {
          throw new Error(data?.error ?? `Upload failed for ${file.name}`);
        }
        uploaded.push(String(data.data.url));
      }

      setEditor((prev) => (prev ? { ...prev, listingImages: [...prev.listingImages, ...uploaded] } : prev));
      setFeedback({ type: "ok", message: `Uploaded ${uploaded.length} image(s). Save listing to publish these changes.` });
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Failed to upload images." });
    } finally {
      setIsUploading(false);
    }
  }

  function normalizeImagesForSave(images: string[], primary: number) {
    if (!images.length) return [];
    const safePrimary = Math.max(0, Math.min(primary, images.length - 1));
    return [images[safePrimary], ...images.filter((_, idx) => idx !== safePrimary)];
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
      listingIntent: editor.listingIntent,
      category: editor.category,
      availability: "AVAILABLE",
      country: "Cambodia",
      currency: editor.currency,
      status: editor.status,
      verificationState: "UNVERIFIED",
      featured: editor.featured,
      seoTitle: editor.seoTitle || editor.title,
      seoDescription: editor.seoDescription || editor.summary,
      imageUrls: normalizeImagesForSave(editor.listingImages, editor.primaryImageIndex),
      videoUrls: []
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
        setFeedback({ type: "error", message: data?.error ?? "Save failed.", fieldErrors: data?.fieldErrors ?? undefined });
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
        <button className="btn btn-primary" type="button" onClick={() => setEditor(defaultEditor())}>Create listing</button>
      </div>
      {feedback.type === "ok" && <p className="form-ok">{feedback.message}</p>}
      {feedback.type === "error" && <p className="form-error">{feedback.message}</p>}

      <div className="admin-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr><th>Listing</th><th>Status</th><th>Media</th><th>Price</th><th>Updated</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><strong>{row.title}</strong><br /><small>{row.slug}</small></td>
                <td>{row.status}</td>
                <td>{row.mediaCount}</td>
                <td>{row.priceUsd ? `$${row.priceUsd.toLocaleString()}` : "-"}</td>
                <td>{new Date(row.updatedAtIso).toISOString().slice(0, 10)}</td>
                <td><button className="btn btn-ghost" type="button" onClick={() => openEdit(row)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            <label>Price<input type="number" value={editor.priceUsd} onChange={(e) => setEditor((prev) => prev ? { ...prev, priceUsd: Number(e.target.value) } : null)} required /></label>
            <label>Bedrooms<input type="number" value={editor.bedrooms} onChange={(e) => setEditor((prev) => prev ? { ...prev, bedrooms: Number(e.target.value) } : null)} required /></label>
            <label>Bathrooms<input type="number" value={editor.bathrooms} onChange={(e) => setEditor((prev) => prev ? { ...prev, bathrooms: Number(e.target.value) } : null)} required /></label>
            <label>Area sqm<input type="number" value={editor.areaSqm} onChange={(e) => setEditor((prev) => prev ? { ...prev, areaSqm: Number(e.target.value) } : null)} required /></label>
            <label>Status<select value={editor.status} onChange={(e) => setEditor((prev) => prev ? { ...prev, status: e.target.value as EditorState["status"] } : null)}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
            <label className="remember"><input type="checkbox" checked={editor.featured} onChange={(e) => setEditor((prev) => prev ? { ...prev, featured: e.target.checked } : null)} /> Featured</label>
          </div>

          <article className="card-pad">
            <h4>Listing media</h4>
            <p className="muted">Upload JPG/PNG/WEBP/GIF up to 8MB. Reorder images and pick a featured image before saving.</p>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={(e) => void uploadListingImages(e.currentTarget.files)} disabled={isUploading || isSaving} />
            {isUploading && <p className="muted">Uploading images…</p>}
            <div className="thumb-row" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginTop: 12 }}>
              {editor.listingImages.map((url, index) => (
                <article key={`${url}-${index}`} className="card-pad" style={{ padding: 10 }}>
                  <Image src={url} alt={`Listing image ${index + 1}`} width={220} height={130} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} />
                  <label className="remember"><input type="radio" checked={editor.primaryImageIndex === index} onChange={() => setEditor((prev) => prev ? { ...prev, primaryImageIndex: index } : null)} /> Featured image</label>
                  <div className="hero-actions" style={{ gap: 6 }}>
                    <button type="button" className="btn btn-ghost" disabled={index === 0} onClick={() => setEditor((prev) => {
                      if (!prev || index === 0) return prev;
                      const next = [...prev.listingImages];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      const primary = prev.primaryImageIndex === index ? index - 1 : prev.primaryImageIndex === index - 1 ? index : prev.primaryImageIndex;
                      return { ...prev, listingImages: next, primaryImageIndex: primary };
                    })}>↑</button>
                    <button type="button" className="btn btn-ghost" disabled={index === editor.listingImages.length - 1} onClick={() => setEditor((prev) => {
                      if (!prev || index >= prev.listingImages.length - 1) return prev;
                      const next = [...prev.listingImages];
                      [next[index], next[index + 1]] = [next[index + 1], next[index]];
                      const primary = prev.primaryImageIndex === index ? index + 1 : prev.primaryImageIndex === index + 1 ? index : prev.primaryImageIndex;
                      return { ...prev, listingImages: next, primaryImageIndex: primary };
                    })}>↓</button>
                    <button type="button" className="btn btn-accent" onClick={() => setEditor((prev) => {
                      if (!prev) return prev;
                      const next = prev.listingImages.filter((_, i) => i !== index);
                      const primary = next.length === 0 ? 0 : Math.max(0, Math.min(prev.primaryImageIndex > index ? prev.primaryImageIndex - 1 : prev.primaryImageIndex, next.length - 1));
                      return { ...prev, listingImages: next, primaryImageIndex: primary };
                    })}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <div className="hero-actions">
            <button className="btn btn-primary" type="submit" disabled={isSaving || isUploading}>{isSaving ? "Saving…" : editor.mode === "create" ? "Create listing" : "Save listing"}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditor(null)} disabled={isSaving}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
