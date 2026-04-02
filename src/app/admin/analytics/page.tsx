import { db } from "@/lib/db";
import { requireAdmin } from "@/server/guards";
import type { EmailStatus, InquiryType, LeadStatus, ListingStatus } from "@prisma/client";

const LISTING_STATUSES: ListingStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "VIEWING_SCHEDULED", "NEGOTIATION", "WON", "LOST", "ARCHIVED"];
const INQUIRY_TYPES: InquiryType[] = ["LISTING", "CUSTOM_PLAN", "GENERAL", "CONTACT", "VALUATION", "LISTING_SUBMISSION"];
const EMAIL_STATUSES: EmailStatus[] = ["SENT", "FAILED"];

type CountBucket<T extends string> = {
  key: T;
  count: number;
};

function toBuckets<T extends string, K extends string>(
  orderedKeys: readonly T[],
  groupedRows: Array<Record<K, T> & { _count: { _all: number } }>,
  keyName: K
): CountBucket<T>[] {
  const groupedMap = new Map<T, number>();
  for (const row of groupedRows) {
    groupedMap.set(row[keyName], row._count._all);
  }

  return orderedKeys.map((key) => ({ key, count: groupedMap.get(key) ?? 0 }));
}

function renderMetricList<T extends string>(items: CountBucket<T>[], emptyLabel: string) {
  if (!items.length) {
    return <p className="muted">{emptyLabel}</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.key}>
          {item.key}: {item.count}
        </li>
      ))}
    </ul>
  );
}

export default async function AnalyticsPage() {
  await requireAdmin();

  const [
    totalListings,
    totalInquiries,
    totalEmailLogs,
    listingGrouped,
    leadStatusGrouped,
    leadTypeGrouped,
    emailGrouped,
    inquiriesLast7Days,
    wonLeads,
    recentLeads,
    recentListings
  ] = await Promise.all([
    db.listing.count(),
    db.inquiry.count(),
    db.emailLog.count(),
    db.listing.groupBy({ by: ["status"], _count: { _all: true } }),
    db.inquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    db.inquiry.groupBy({ by: ["inquiryType"], _count: { _all: true } }),
    db.emailLog.groupBy({ by: ["status"], _count: { _all: true } }),
    db.inquiry.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    db.inquiry.count({ where: { status: "WON" } }),
    db.inquiry.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, inquiryType: true, status: true, createdAt: true }
    }),
    db.listing.findMany({
      take: 8,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, status: true, updatedAt: true }
    })
  ]);

  const listingsByStatus = toBuckets(LISTING_STATUSES, listingGrouped, "status");
  const leadsByStatus = toBuckets(LEAD_STATUSES, leadStatusGrouped, "status");
  const leadsByType = toBuckets(INQUIRY_TYPES, leadTypeGrouped, "inquiryType");
  const emailsByStatus = toBuckets(EMAIL_STATUSES, emailGrouped, "status");

  const publishedCount = listingsByStatus.find((x) => x.key === "PUBLISHED")?.count ?? 0;
  const publishRate = totalListings > 0 ? Math.round((publishedCount / totalListings) * 100) : 0;
  const leadToWonRate = totalInquiries > 0 ? Math.round((wonLeads / totalInquiries) * 100) : 0;

  return (
    <section className="section">
      <div className="section-head">
        <h2>Performance & Funnel Analytics</h2>
        <p className="muted">Operational scorecard for listings, leads, and messaging reliability.</p>
      </div>

      <div className="stat-grid">
        <article className="stat-card"><p>{totalListings}</p><span>Total listings</span></article>
        <article className="stat-card"><p>{publishRate}%</p><span>Listings published rate</span></article>
        <article className="stat-card"><p>{totalInquiries}</p><span>Total inquiries</span></article>
        <article className="stat-card"><p>{inquiriesLast7Days}</p><span>Inquiries (last 7 days)</span></article>
        <article className="stat-card"><p>{wonLeads}</p><span>Won leads</span></article>
        <article className="stat-card"><p>{leadToWonRate}%</p><span>Lead to won conversion</span></article>
        <article className="stat-card"><p>{totalEmailLogs}</p><span>Total email logs</span></article>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h3>Listings by status</h3>
          {renderMetricList(listingsByStatus, "No listing status data yet.")}
        </article>
        <article className="card-pad">
          <h3>Leads by stage</h3>
          {renderMetricList(leadsByStatus, "No lead stage data yet.")}
        </article>
        <article className="card-pad">
          <h3>Leads by inquiry type</h3>
          {renderMetricList(leadsByType, "No inquiry type data yet.")}
        </article>
        <article className="card-pad">
          <h3>Email delivery health</h3>
          {renderMetricList(emailsByStatus, "No email delivery data yet.")}
        </article>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h3>Recent inquiry activity</h3>
          {recentLeads.length ? (
            <ul>
              {recentLeads.map((lead) => (
                <li key={lead.id}>{lead.fullName} · {lead.inquiryType} · {lead.status} · {lead.createdAt.toISOString().slice(0, 10)}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No inquiries have been submitted yet.</p>
          )}
        </article>

        <article className="card-pad">
          <h3>Recent listing activity</h3>
          {recentListings.length ? (
            <ul>
              {recentListings.map((listing) => (
                <li key={listing.id}>{listing.title} · {listing.status} · {listing.updatedAt.toISOString().slice(0, 10)}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No listings have been created yet.</p>
          )}
        </article>
      </div>
    </section>
  );
}
