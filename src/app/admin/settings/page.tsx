import { requireAdmin } from "@/server/guards";
import { getContactSettings } from "@/lib/site-settings";
import { ContactSettingsForm } from "@/components/admin/contact-settings-form";
import { db } from "@/lib/db";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const [contact, emailLogs] = await Promise.all([
    getContactSettings(),
    db.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 })
  ]);

  return (
    <section className="shell section two-col">
      <ContactSettingsForm initial={contact} />
      <article className="card-pad">
        <h2>Email logs</h2>
        <p className="muted">Tracks all transactional messages (enquiry, valuation, contact confirmations).</p>
        <div className="admin-table-wrap">
          <table className="comparison-table">
            <thead><tr><th>Type</th><th>Recipient</th><th>Status</th><th>Timestamp (UTC)</th></tr></thead>
            <tbody>
              {emailLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.type}</td>
                  <td>{log.recipient}</td>
                  <td>{log.status}</td>
                  <td>{new Date(log.createdAt).toISOString().replace("T", " ").slice(0, 19)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
