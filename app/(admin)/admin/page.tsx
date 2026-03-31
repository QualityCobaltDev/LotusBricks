import { leads, emailLogs } from "@/lib/server-store";

export default function AdminHomePage() {
  const newLeads = leads.filter((l) => l.status === "new").length;
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
      <p className="mt-2 text-slate-600">Manage listings, leads, communication reliability, and contact settings.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Total leads</p><p className="text-2xl font-bold">{leads.length}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">New leads</p><p className="text-2xl font-bold">{newLeads}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Email logs</p><p className="text-2xl font-bold">{emailLogs.length}</p></div>
      </div>
    </div>
  );
}
