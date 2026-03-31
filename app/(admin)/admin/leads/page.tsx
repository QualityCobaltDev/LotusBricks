import { leads } from "@/lib/server-store";

export default function AdminLeadsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Lead Management</h1>
      <p className="mt-2 text-neutral-600">Track enquiries, valuation requests, and contact form submissions.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-full text-sm"><thead className="bg-neutral-50"><tr><th className="p-3 text-left">Type</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Source</th><th className="p-3 text-left">Timestamp</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id} className="border-t"><td className="p-3">{lead.type}</td><td className="p-3">{lead.name}</td><td className="p-3">{lead.email}</td><td className="p-3">{lead.status}</td><td className="p-3">{lead.sourcePage}</td><td className="p-3">{new Date(lead.createdAt).toLocaleString()}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
