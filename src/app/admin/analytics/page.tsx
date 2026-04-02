import { db } from "@/lib/db";
import { requireAdmin } from "@/server/guards";

export default async function AnalyticsPage() {
  await requireAdmin();

  const [listingStatus, leadStatus, leadSource, emailHealth] = await Promise.all([
    db.listing.groupBy({ by: ["status"], _count: true }),
    db.inquiry.groupBy({ by: ["status"], _count: true }),
    db.inquiry.groupBy({ by: ["inquiryType"], _count: true }),
    db.emailLog.groupBy({ by: ["status"], _count: true })
  ]);

  return (
    <section className="section">
      <div className="section-head">
        <h2>Performance & Funnel Analytics</h2>
        <p className="muted">Operational scorecard for listings, leads, and messaging reliability.</p>
      </div>
      <div className="two-col">
        <article className="card-pad">
          <h3>Listings by status</h3>
          <ul>{listingStatus.map((row) => <li key={row.status}>{row.status}: {row._count}</li>)}</ul>
        </article>
        <article className="card-pad">
          <h3>Leads by stage</h3>
          <ul>{leadStatus.map((row) => <li key={row.status}>{row.status}: {row._count}</li>)}</ul>
        </article>
        <article className="card-pad">
          <h3>Leads by source type</h3>
          <ul>{leadSource.map((row) => <li key={row.inquiryType}>{row.inquiryType}: {row._count}</li>)}</ul>
        </article>
        <article className="card-pad">
          <h3>Email delivery health</h3>
          <ul>{emailHealth.map((row) => <li key={row.status}>{row.status}: {row._count}</li>)}</ul>
        </article>
      </div>
    </section>
  );
}
