import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";
import { PLAN_CONFIG } from "@/lib/plans";
import { ListingsControlTable } from "@/components/admin/listings-control-table";

export default async function AdminListings() {
  await requireAdmin();
  const [listings, counts] = await Promise.all([
    db.listing.findMany({ orderBy: { updatedAt: "desc" }, include: { media: true, owner: { select: { fullName: true, planTier: true } } } }),
    db.listing.groupBy({ by: ["status"], _count: true })
  ]);

  return (
    <section className="section">
      <div className="section-head">
        <h2>Listing Operations</h2>
        <p className="muted">Manage listing lifecycle, ownership, and media governance in one control surface.</p>
      </div>
      <div className="three-col">
        {counts.map((x) => <article className="stat-card" key={x.status}><p>{x._count}</p><span>{x.status}</span></article>)}
        <article className="stat-card"><p>{PLAN_CONFIG.TIER_1.photosPerListing}</p><span>Photo limit baseline</span></article>
        <article className="stat-card"><p>{PLAN_CONFIG.TIER_1.videosPerListing}</p><span>Video limit baseline</span></article>
      </div>
      <ListingsControlTable rows={listings} />
    </section>
  );
}
