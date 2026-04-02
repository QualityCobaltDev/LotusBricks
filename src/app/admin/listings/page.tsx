import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";
import { PLAN_CONFIG } from "@/lib/plans";
import { ListingsControlTable, type AdminListingRow } from "@/components/admin/listings-control-table";
import { logServerError } from "@/lib/observability";
import type { Prisma } from "@prisma/client";

type ListingStatusCount = {
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  count: number;
};

type AdminListingRecord = Prisma.ListingGetPayload<{
  include: {
    media: { select: { id: true } };
    owner: { select: { fullName: true; planTier: true } };
  };
}>;

function normalizeAdminListingRows(rows: AdminListingRecord[]): AdminListingRow[] {
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title || "Untitled listing",
    status: row.status,
    ownerName: row.owner?.fullName ?? "Unassigned",
    ownerPlanTier: row.owner?.planTier ?? null,
    mediaCount: Array.isArray(row.media) ? row.media.length : 0,
    updatedAtIso: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : new Date().toISOString()
  }));
}

export default async function AdminListings() {
  await requireAdmin();

  let rows: AdminListingRow[] = [];
  const countsByStatus: ListingStatusCount[] = [
    { status: "DRAFT", count: 0 },
    { status: "PUBLISHED", count: 0 },
    { status: "ARCHIVED", count: 0 }
  ];
  let loadError = false;

  try {
    const [listings, counts] = await Promise.all([
      db.listing.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          media: { select: { id: true } },
          owner: { select: { fullName: true, planTier: true } }
        }
      }),
      db.listing.groupBy({ by: ["status"], _count: { _all: true } })
    ]);

    rows = normalizeAdminListingRows(listings);

    for (const item of counts) {
      const statusKey = item.status as ListingStatusCount["status"];
      const target = countsByStatus.find((entry) => entry.status === statusKey);
      if (target) target.count = item._count._all;
    }
  } catch (error) {
    loadError = true;
    logServerError("admin-listings", error);
  }

  return (
    <section className="section">
      <div className="section-head">
        <h2>Listing Operations</h2>
        <p className="muted">Manage listing lifecycle, ownership, and media governance in one control surface.</p>
      </div>
      <div className="three-col">
        {countsByStatus.map((x) => (
          <article className="stat-card" key={x.status}>
            <p>{x.count}</p>
            <span>{x.status}</span>
          </article>
        ))}
        <article className="stat-card"><p>{PLAN_CONFIG.TIER_1.photosPerListing}</p><span>Photo limit baseline</span></article>
        <article className="stat-card"><p>{PLAN_CONFIG.TIER_1.videosPerListing}</p><span>Video limit baseline</span></article>
      </div>

      {loadError ? (
        <article className="empty-state">
          <h3>Listings are temporarily unavailable</h3>
          <p>We could not load listing operations right now. Please refresh in a moment.</p>
        </article>
      ) : (
        <ListingsControlTable rows={rows} />
      )}
    </section>
  );
}
