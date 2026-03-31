"use client";

import { useEffect, useState } from "react";

type Row = { id: string; slug: string; title: string; status: string; priceUsd: number; city: string; district: string; intent: string; propertyType: string; description: string };

const empty = { slug: "", title: "", description: "", priceUsd: 100000, city: "Phnom Penh", district: "BKK1", propertyType: "Condo", intent: "buy", status: "DRAFT" };

export default function AdminListingsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<any>(empty);

  async function load() {
    const res = await fetch("/api/admin/listings");
    const json = await res.json();
    setRows(json.rows || []);
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/listings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm(empty);
    load();
  }

  async function remove(id: string) {
    await fetch("/api/admin/listings", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  return <div><h1 className="text-2xl font-bold">Listings</h1><form onSubmit={submit} className="mt-4 grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-2"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded border px-3 py-2" required /><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="rounded border px-3 py-2" required /><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="rounded border px-3 py-2" required /><input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="District" className="rounded border px-3 py-2" required /><input type="number" value={form.priceUsd} onChange={(e) => setForm({ ...form, priceUsd: Number(e.target.value) })} placeholder="Price" className="rounded border px-3 py-2" required /><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded border px-3 py-2"><option>DRAFT</option><option>PUBLISHED</option><option>PAUSED</option><option>ARCHIVED</option></select><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded border px-3 py-2 md:col-span-2" placeholder="Description" required /><button className="rounded bg-primary-600 px-3 py-2 text-white md:col-span-2">{form.id ? "Update" : "Create"} listing</button></form><div className="mt-4 overflow-x-auto rounded-xl border bg-white"><table className="min-w-full text-sm"><thead className="bg-neutral-50"><tr><th className="p-3 text-left">Title</th><th className="p-3">Status</th><th className="p-3">Price</th><th className="p-3">Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-t"><td className="p-3">{row.title}<div className="text-xs text-neutral-500">/{row.slug}</div></td><td className="p-3">{row.status}</td><td className="p-3">${row.priceUsd.toLocaleString()}</td><td className="p-3"><button onClick={() => setForm(row)} className="mr-2 text-primary-700">Edit</button><button onClick={() => remove(row.id)} className="text-secondary-700">Delete</button></td></tr>)}</tbody></table></div></div>;
}
