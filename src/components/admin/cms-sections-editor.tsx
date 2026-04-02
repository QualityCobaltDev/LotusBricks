"use client";

import { useState } from "react";

type Row = { id: string; key: string; title: string; body: string; meta: unknown; updatedAt: string | Date };

export function CmsSectionsEditor({ rows }: { rows: Row[] }) {
  const [active, setActive] = useState(rows[0]?.key ?? "homepage");
  const [state, setState] = useState<{ type: "idle" | "ok" | "error"; message?: string }>({ type: "idle" });
  const [isSaving, setIsSaving] = useState(false);

  const current = rows.find((r) => r.key === active) ?? rows[0];

  async function save(formData: FormData) {
    if (!current) return;

    setState({ type: "idle" });
    setIsSaving(true);

    const payload = {
      key: current.key,
      title: String(formData.get("title") ?? current.title).trim(),
      body: String(formData.get("body") ?? current.body).trim(),
      meta: {
        seoTitle: String(formData.get("seoTitle") ?? "").trim(),
        seoDescription: String(formData.get("seoDescription") ?? "").trim(),
        ogImage: String(formData.get("ogImage") ?? "").trim(),
        internalNotes: String(formData.get("internalNotes") ?? "").trim(),
        publishedState: String(formData.get("publishedState") ?? "draft")
      }
    };

    try {
      const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setState({ type: "error", message: data?.error ?? "Failed to save section." });
        return;
      }
      setState({ type: "ok", message: data?.message ?? "Saved." });
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="two-col">
      <article className="card-pad">
        <h3>Page sections</h3>
        <div className="admin-nav-links">
          {rows.map((row) => <button key={row.id} className={row.key === active ? "admin-tab active" : "admin-tab"} onClick={() => setActive(row.key)} type="button">{row.title}</button>)}
        </div>
      </article>
      {current && (
        <form action={save} className="stack-form card-pad">
          <h3>{current.title}</h3>
          <label>Public title<input name="title" required defaultValue={current.title} /></label>
          <label>Page body / section content<textarea rows={10} name="body" required defaultValue={current.body} /></label>
          <label>SEO title<input name="seoTitle" defaultValue={String((current.meta as Record<string, string> | null)?.seoTitle ?? "")} /></label>
          <label>SEO description<textarea rows={3} name="seoDescription" defaultValue={String((current.meta as Record<string, string> | null)?.seoDescription ?? "")} /></label>
          <label>OG image URL<input name="ogImage" defaultValue={String((current.meta as Record<string, string> | null)?.ogImage ?? "")} /></label>
          <label>Internal admin notes<textarea rows={3} name="internalNotes" defaultValue={String((current.meta as Record<string, string> | null)?.internalNotes ?? "")} /></label>
          <label>Publication state<select name="publishedState" defaultValue={String((current.meta as Record<string, string> | null)?.publishedState ?? "draft")}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <button className="btn btn-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save section"}</button>
          {state.type === "ok" && <p className="form-ok">{state.message}</p>}
          {state.type === "error" && <p className="form-error">Save failed: {state.message}</p>}
        </form>
      )}
    </div>
  );
}
