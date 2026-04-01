import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";
import { PLAN_CONFIG } from "@/lib/plans";

export default async function AdminListings() {
  await requireAdmin();
  const listings = await db.listing.findMany({ orderBy: { updatedAt: "desc" }, include: { media: true, owner: { select: { fullName: true, planTier: true } } } });
  return (
    <section>
      <h1>Manage listings</h1>
      <p>API validations enforce: max {PLAN_CONFIG.TIER_1.photosPerListing} photos and {PLAN_CONFIG.TIER_1.videosPerListing} videos per listing.</p>
      <div className="grid">
        {listings.map((x) => {
          const images = x.media.filter((item) => item.kind === "image").length;
          const videos = x.media.filter((item) => item.kind === "video").length;
          return (
            <article className="card" key={x.id}>
              <strong>{x.title}</strong>
              <p>{x.status}</p>
              <p>Owner: {x.owner?.fullName ?? "Unassigned"} ({x.owner?.planTier ?? "n/a"})</p>
              <p>{images}/10 photos · {videos}/2 videos</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
