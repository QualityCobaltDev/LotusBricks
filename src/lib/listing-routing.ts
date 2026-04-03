import { db } from "@/lib/db";
import { normalizeListingSlug } from "@/lib/listing-slug";

export async function resolveListingSlug(inputSlug: string) {
  const normalized = normalizeListingSlug(inputSlug);
  if (!normalized) return null;

  const direct = await db.listing.findUnique({ where: { slug: normalized }, select: { id: true, slug: true } });
  if (direct) return { listingId: direct.id, slug: direct.slug, redirectFromLegacy: false };

  const history = await db.listingSlugHistory.findUnique({
    where: { slug: normalized },
    include: { listing: { select: { id: true, slug: true } } }
  });

  if (!history?.listing) return null;
  return { listingId: history.listing.id, slug: history.listing.slug, redirectFromLegacy: true };
}
