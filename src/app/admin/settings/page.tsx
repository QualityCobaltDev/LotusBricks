import { requireAdmin } from "@/server/guards";
import { getContactSettings } from "@/lib/site-settings";
import { ContactSettingsForm } from "@/components/admin/contact-settings-form";
import { db } from "@/lib/db";
import { BrandSettingsForm } from "@/components/admin/brand-settings-form";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const [contact, emailLogs, brandSettings] = await Promise.all([
    getContactSettings(),
    db.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.siteSetting.findUnique({ where: { key: "admin.brand-settings.v1" } })
  ]);

  return (
    <section className="section two-col">
      <div className="stack-form">
        <BrandSettingsForm initial={(brandSettings?.value as Record<string, string> | undefined) ?? {}} />
        <ContactSettingsForm initial={contact} />
      </div>
      <article className="card-pad">
        <h2>Messaging logs & SMTP controls</h2>
        <p className="muted">Tracks transactional emails and operational notifications.</p>
        <form action="/api/admin/test-email" method="post">
          <button className="btn btn-ghost" type="submit">Send SMTP test email</button>
        </form>
        <div className="admin-table-wrap">
          <table className="comparison-table">
            <thead><tr><th>Type</th><th>Recipient</th><th>Subject</th><th>Status</th><th>Provider response</th><th>Timestamp (UTC)</th></tr></thead>
            <tbody>
              {emailLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.type}</td>
                  <td>{log.recipient}</td>
                  <td>{log.subject}</td>
                  <td>{log.status}</td>
                  <td>{log.error ?? "Delivered"}</td>
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
