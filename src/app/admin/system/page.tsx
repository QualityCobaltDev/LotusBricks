import { requireAdmin } from "@/server/guards";
import { getAuditEvents } from "@/lib/admin-control";
import { db } from "@/lib/db";

export default async function SystemPage() {
  await requireAdmin();
  const [audit, recentEmails] = await Promise.all([
    getAuditEvents(),
    db.emailLog.findMany({ take: 25, orderBy: { createdAt: "desc" } })
  ]);

  return (
    <section className="section">
      <div className="section-head">
        <h2>System & Audit Logs</h2>
        <p className="muted">Track operator actions, delivery events, and platform-side operational signals.</p>
      </div>
      <div className="two-col">
        <article className="card-pad">
          <h3>Audit trail</h3>
          <div className="admin-table-wrap">
            <table className="comparison-table">
              <thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Object</th><th>Summary</th></tr></thead>
              <tbody>
                {audit.map((event, i) => (
                  <tr key={`${event.at}-${i}`}>
                    <td>{event.at}</td><td>{event.actor}</td><td>{event.action}</td><td>{event.objectType}</td><td>{event.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className="card-pad">
          <h3>Email event logs</h3>
          <div className="admin-table-wrap">
            <table className="comparison-table">
              <thead><tr><th>Type</th><th>Recipient</th><th>Status</th><th>Timestamp</th></tr></thead>
              <tbody>
                {recentEmails.map((log) => (
                  <tr key={log.id}><td>{log.type}</td><td>{log.recipient}</td><td>{log.status}</td><td>{log.createdAt.toISOString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
