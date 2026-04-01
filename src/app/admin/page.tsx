import Link from "next/link";
import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";

export default async function AdminPage() {
  await requireAdmin();
  const [users, listings, inquiries, customInquiries, liveListings, newLeadsWeek, emailsSent, emailsFailed] = await Promise.all([
    db.user.count(),
    db.listing.count(),
    db.inquiry.count(),
    db.inquiry.count({ where: { inquiryType: "CUSTOM_PLAN" } }),
    db.listing.count({ where: { status: "PUBLISHED" } }),
    db.inquiry.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    db.emailLog.count({ where: { status: "SENT" } }),
    db.emailLog.count({ where: { status: "FAILED" } })
  ]);

  return (
    <section className="shell section">
      <h1>Admin dashboard</h1>
      <div className="stat-grid">
        <article className="stat-card"><p>{users}</p><span>Users</span></article>
        <article className="stat-card"><p>{listings}</p><span>Total listings</span></article>
        <article className="stat-card"><p>{liveListings}</p><span>Live listings</span></article>
        <article className="stat-card"><p>{inquiries}</p><span>Total leads</span></article>
        <article className="stat-card"><p>{newLeadsWeek}</p><span>New leads (7d)</span></article>
        <article className="stat-card"><p>{customInquiries}</p><span>Custom plan leads</span></article>
        <article className="stat-card"><p>{emailsSent}</p><span>Emails sent</span></article>
        <article className="stat-card"><p>{emailsFailed}</p><span>Email failures</span></article>
      </div>
      <p>
        <Link href='/admin/listings'>Manage listings</Link> · <Link href='/admin/inquiries'>Lead management</Link> · <Link href='/admin/users'>Users</Link> · <Link href='/admin/content'>Content</Link> · <Link href='/admin/pricing'>Pricing</Link> · <Link href='/admin/settings'>Settings & SMTP</Link>
      </p>
    </section>
  );
}
