import Link from "next/link";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/ui/listing-card";
import { logServerError } from "@/lib/observability";

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; min?: string; max?: string; beds?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const min = Number(params.min) || 0;
  const max = Number(params.max) || undefined;
  const beds = Number(params.beds) || 0;

  let listings: Awaited<ReturnType<typeof db.listing.findMany>> = [];

  try {
    listings = await db.listing.findMany({
      where: {
        status: "PUBLISHED",
        priceUsd: { gte: min, lte: max },
        bedrooms: beds ? { gte: beds } : undefined,
        OR: q
          ? [{ city: { contains: q, mode: "insensitive" } }, { district: { contains: q, mode: "insensitive" } }, { title: { contains: q, mode: "insensitive" } }]
          : undefined
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } }
    });
  } catch (error) {
    logServerError("listings-page", error, { q, min, max, beds });
  }

  return (
    <section className="shell section">
      <div className="section-head">
        <h1>Browse verified listings</h1>
        <p className="muted">Filter by location, budget, and property profile to move faster with confidence.</p>
      </div>

      <form className="filter-bar" method="GET">
        <input name="q" defaultValue={q} placeholder="City, district, or keyword" />
        <input name="min" type="number" defaultValue={min || ""} placeholder="Min price" />
        <input name="max" type="number" defaultValue={max || ""} placeholder="Max price" />
        <select name="beds" defaultValue={beds || ""}>
          <option value="">Any beds</option>
          <option value="1">1+ beds</option>
          <option value="2">2+ beds</option>
          <option value="3">3+ beds</option>
          <option value="4">4+ beds</option>
        </select>
        <button className="btn btn-primary" type="submit">Apply filters</button>
      </form>

      {listings.length ? (
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <article className="empty-state">
          <h3>No listings matched your filters</h3>
          <p>Try widening your price range or removing a filter to discover more opportunities.</p>
          <Link href="/listings" className="btn btn-ghost">Reset filters</Link>
        </article>
      )}
    </section>
  );
}
