import Link from "next/link";
import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";

const day = 24 * 60 * 60 * 1000;

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    users,
    activeCustomers,
    activeAdmins,
    totalListings,
    publishedListings,
    draftListings,
    archivedListings,
    totalLeads,
    leadsToday,
    leads7d,
    leads30d,
    contactSubmissions,
    valuationRequests,
    customPlanRequests,
    emailsSent,
    emailsFailed,
    recentListings,
    recentLeads,
    recentUsers
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "CUSTOMER", isActive: true } }),
    db.user.count({ where: { role: "ADMIN", isActive: true } }),
    db.listing.count(),
    db.listing.count({ where: { status: "PUBLISHED" } }),
    db.listing.count({ where: { status: "DRAFT" } }),
    db.listing.count({ where: { status: "ARCHIVED" } }),
    db.inquiry.count(),
    db.inquiry.count({ where: { createdAt: { gte: new Date(Date.now() - day) } } }),
    db.inquiry.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * day) } } }),
    db.inquiry.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * day) } } }),
    db.inquiry.count({ where: { inquiryType: "CONTACT" } }),
    db.inquiry.count({ where: { inquiryType: "VALUATION" } }),
    db.inquiry.count({ where: { inquiryType: "CUSTOM_PLAN" } }),
    db.emailLog.count({ where: { status: "SENT" } }),
    db.emailLog.count({ where: { status: "FAILED" } }),
    db.listing.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, title: true, status: true, createdAt: true } }),
    db.inquiry.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, fullName: true, inquiryType: true, status: true, createdAt: true } }),
    db.user.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, fullName: true, email: true, role: true, createdAt: true } })
  ]);

  return (
    <section className="section">
      <div className="section-head">
        <h2>Executive Operations Dashboard</h2>
        <p className="muted">Unified operational pulse for users, inventory, lead pipeline, and communications.</p>
      </div>
      <div className="stat-grid">
        <article className="stat-card"><p>{users}</p><span>Total users</span></article>
        <article className="stat-card"><p>{activeCustomers}</p><span>Active customers</span></article>
        <article className="stat-card"><p>{activeAdmins}</p><span>Active admins/staff</span></article>
        <article className="stat-card"><p>{totalListings}</p><span>Total listings</span></article>
        <article className="stat-card"><p>{publishedListings}</p><span>Published listings</span></article>
        <article className="stat-card"><p>{draftListings}</p><span>Draft listings</span></article>
        <article className="stat-card"><p>{archivedListings}</p><span>Archived listings</span></article>
        <article className="stat-card"><p>{totalLeads}</p><span>Total leads</span></article>
        <article className="stat-card"><p>{leadsToday}</p><span>New leads today</span></article>
        <article className="stat-card"><p>{leads7d}</p><span>New leads (7d)</span></article>
        <article className="stat-card"><p>{leads30d}</p><span>New leads (30d)</span></article>
        <article className="stat-card"><p>{contactSubmissions}</p><span>Contact submissions</span></article>
        <article className="stat-card"><p>{valuationRequests}</p><span>Valuation requests</span></article>
        <article className="stat-card"><p>{customPlanRequests}</p><span>Custom plan requests</span></article>
        <article className="stat-card"><p>{emailsSent}</p><span>Emails sent</span></article>
        <article className="stat-card"><p>{emailsFailed}</p><span>Email failures</span></article>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h3>Quick actions</h3>
          <p><Link href="/admin/listings">Manage listings</Link> · <Link href="/admin/inquiries">Lead board</Link> · <Link href="/admin/content">Website CMS</Link> · <Link href="/admin/settings">SMTP + settings</Link></p>
        </article>
        <article className="card-pad">
          <h3>System notices</h3>
          <ul>
            <li>Email failures should be reviewed daily.</li>
            <li>Draft inventory should be aged and triaged weekly.</li>
            <li>Unassigned fresh leads should be actioned within 30 minutes.</li>
          </ul>
        </article>
      </div>

      <div className="three-col">
        <article className="card-pad">
          <h3>Recent listings</h3>
          <ul>{recentListings.map((x) => <li key={x.id}>{x.title} · {x.status} · {x.createdAt.toISOString().slice(0, 10)}</li>)}</ul>
        </article>
        <article className="card-pad">
          <h3>Recent leads</h3>
          <ul>{recentLeads.map((x) => <li key={x.id}>{x.fullName} · {x.inquiryType} · {x.status}</li>)}</ul>
        </article>
        <article className="card-pad">
          <h3>Recent customer signups</h3>
          <ul>{recentUsers.map((x) => <li key={x.id}>{x.fullName} ({x.role}) · {x.email}</li>)}</ul>
        </article>
      </div>
    </section>
  );
}
