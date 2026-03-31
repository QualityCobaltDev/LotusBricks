import { emailLogs } from "@/lib/server-store";

export default function AdminEmailLogsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Email Logs</h1>
      <p className="mt-2 text-slate-600">Monitor transactional delivery health by recipient and event type.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">Type</th><th className="p-3 text-left">Recipient</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Subject</th><th className="p-3 text-left">Timestamp</th></tr></thead><tbody>{emailLogs.map((log) => <tr key={log.id} className="border-t"><td className="p-3">{log.type}</td><td className="p-3">{log.recipient}</td><td className="p-3">{log.status}</td><td className="p-3">{log.subject}</td><td className="p-3">{new Date(log.createdAt).toLocaleString()}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
