"use client";

import { useState } from "react";

type Row = { id: string; key: string; title: string; body: string; meta: unknown; updatedAt: string | Date };

export function CmsSectionsEditor({ rows }: { rows: Row[] }) {
  const [active, setActive] = useState(rows[0]?.key ?? "homepage");
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");

  const current = rows.find((r) => r.key === active) ?? rows[0];

  async function save(formData: FormData) {
    setState("idle");
    const payload = {
      key: current.key,
      title: String(formData.get("title") ?? current.title),
      body: String(formData.get("body") ?? current.body),
      meta: {
        seoTitle: String(formData.get("seoTitle") ?? ""),
        seoDescription: String(formData.get("seoDescription") ?? ""),
        ogImage: String(formData.get("ogImage") ?? ""),
        internalNotes: String(formData.get("internalNotes") ?? ""),
        publishedState: String(formData.get("publishedState") ?? "draft")
      }
    };

    const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setState(res.ok ? "ok" : "error");
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
          <label>Public title<input name="title" defaultValue={current.title} /></label>
          <label>Page body / section content<textarea rows={10} name="body" defaultValue={current.body} /></label>
          <label>SEO title<input name="seoTitle" defaultValue={String((current.meta as Record<string, string> | null)?.seoTitle ?? "")} /></label>
          <label>SEO description<textarea rows={3} name="seoDescription" defaultValue={String((current.meta as Record<string, string> | null)?.seoDescription ?? "")} /></label>
          <label>OG image URL<input name="ogImage" defaultValue={String((current.meta as Record<string, string> | null)?.ogImage ?? "")} /></label>
          <label>Internal admin notes<textarea rows={3} name="internalNotes" defaultValue={String((current.meta as Record<string, string> | null)?.internalNotes ?? "")} /></label>
          <label>Publication state<select name="publishedState" defaultValue={String((current.meta as Record<string, string> | null)?.publishedState ?? "draft")}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <button className="btn btn-primary" type="submit">Save section</button>
          {state === "ok" && <p className="form-ok">Saved.</p>}
          {state === "error" && <p className="form-error">Failed to save.</p>}
        </form>
      )}
    </div>
  );
}
