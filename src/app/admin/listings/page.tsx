import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";
import { PLAN_CONFIG } from "@/lib/plans";
import Image from "next/image";
import { getCardThumbnail, normalizeListingMedia } from "@/lib/listing-media";

export default async function AdminListings() {
  await requireAdmin();
  const listings = await db.listing.findMany({ orderBy: { updatedAt: "desc" }, include: { media: true, owner: { select: { fullName: true, planTier: true } } } });
  return (
    <section>
      <h1>Manage listings</h1>
      <p>API validations enforce: max {PLAN_CONFIG.TIER_1.photosPerListing} photos and {PLAN_CONFIG.TIER_1.videosPerListing} videos per listing.</p>
      <div className="grid">
        {listings.map((x) => {
          const media = normalizeListingMedia(x.media, x.title);
          const images = media.filter((item) => item.type === "image").length;
          const videos = media.filter((item) => item.type === "video").length;
          const seeded = media.filter((item) => item.sourceType === "seed").length;
          return (
            <article className="card" key={x.id}>
              <Image src={getCardThumbnail(media)} alt={x.title} width={360} height={220} className="listing-media" />
              <strong>{x.title}</strong>
              <p>{x.status}</p>
              <p>Owner: {x.owner?.fullName ?? "Unassigned"} ({x.owner?.planTier ?? "n/a"})</p>
              <p>{images}/10 photos · {videos}/2 videos</p>
              <p>Seeded media: {seeded} · Uploaded media: {media.length - seeded}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
