import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { db, isDatabaseConfigured } from "@/lib/db";
import { ListingCard } from "@/components/ui/listing-card";
import { logServerError } from "@/lib/observability";

export const metadata: Metadata = buildMetadata({
  title: "Verified Property Listings Cambodia",
  description: "Explore verified apartments, villas, and investment property listings across Cambodia.",
  path: "/listings"
});

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; min?: string; max?: string; beds?: string; baths?: string; city?: string; sort?: string; listingType?: string; category?: string; furnished?: string; featured?: string; areaMin?: string; areaMax?: string; landMin?: string; landMax?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const city = params.city?.trim() ?? "";
  const min = Number(params.min) || 0;
  const max = Number(params.max) || undefined;
  const beds = Number(params.beds) || 0;
  const baths = Number(params.baths) || 0;
  const sort = params.sort ?? "featured";
  const listingType = params.listingType?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const furnished = params.furnished?.trim() ?? "";
  const featured = params.featured === "true";
  const areaMin = Number(params.areaMin) || 0;
  const areaMax = Number(params.areaMax) || undefined;
  const landMin = Number(params.landMin) || 0;
  const landMax = Number(params.landMax) || undefined;

  let listings: Awaited<ReturnType<typeof db.listing.findMany>> = [];
  let inventoryState: "live" | "unavailable" = "live";

  if (isDatabaseConfigured()) {
    try {
      listings = await db.listing.findMany({
      where: {
        status: "PUBLISHED",
        priceUsd: { gte: min, lte: max },
        bedrooms: beds ? { gte: beds } : undefined,
        bathrooms: baths ? { gte: baths } : undefined,
        city: city ? { contains: city, mode: "insensitive" } : undefined,
        listingType: listingType ? listingType as any : undefined,
        category: category ? category as any : undefined,
        featured: params.featured ? featured : undefined,
        furnishing: furnished ? furnished as any : undefined,
        areaSqm: areaMin || areaMax ? { gte: areaMin || undefined, lte: areaMax } : undefined,
        landAreaSqm: landMin || landMax ? { gte: landMin || undefined, lte: landMax } : undefined,
        OR: q
          ? [{ city: { contains: q, mode: "insensitive" } }, { district: { contains: q, mode: "insensitive" } }, { title: { contains: q, mode: "insensitive" } }]
          : undefined
      },
      orderBy:
        sort === "price_asc"
          ? [{ priceUsd: "asc" }]
          : sort === "price_desc"
            ? [{ priceUsd: "desc" }]
            : sort === "newest"
              ? [{ createdAt: "desc" }]
              : [{ featured: "desc" }, { createdAt: "desc" }],
      include: { media: { where: { kind: "image" }, orderBy: { sortOrder: "asc" }, take: 1 } },
      take: 18
    });
    } catch (error) {
      inventoryState = "unavailable";
      logServerError("listings-page", error, { q, min, max, beds, baths });
    }
  } else {
    inventoryState = "unavailable";
  }

  const hasFilters = Boolean(q || city || min || max || beds || baths || listingType || category || furnished || params.featured || areaMin || areaMax || landMin || landMax);

  return (
    <section className="shell section">
      <div className="section-head">
        <h1>Browse verified listings</h1>
        <p className="muted">Search Phnom Penh, Siem Reap, Sihanoukville, and other growth corridors with confidence signals on every listing.</p>
      </div>

      <form className="filter-bar" method="GET" aria-label="Listings filters">
        <input name="q" defaultValue={q} placeholder="City, district, keyword" />
        <input name="city" defaultValue={city} placeholder="City" />
        <input name="min" type="number" defaultValue={min || ""} placeholder="Min USD" />
        <input name="max" type="number" defaultValue={max || ""} placeholder="Max USD" />
        <select name="listingType" defaultValue={listingType}>
          <option value="">All types</option><option value="SALE">For sale</option><option value="RENT">For rent</option><option value="COMMERCIAL">Commercial</option><option value="LAND">Land</option><option value="LUXURY">Luxury</option><option value="INVESTMENT">Investment</option>
        </select>
        <select name="category" defaultValue={category}>
          <option value="">All categories</option><option value="VILLA">Villa</option><option value="CONDO">Condo</option><option value="APARTMENT">Apartment</option><option value="TOWNHOUSE">Townhouse</option><option value="PENTHOUSE">Penthouse</option><option value="OFFICE">Office</option><option value="SHOPHOUSE">Shophouse</option><option value="LAND">Land</option><option value="WAREHOUSE">Warehouse</option>
        </select>
        <select name="beds" defaultValue={beds || ""}>
          <option value="">Any beds</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
        </select>
        <select name="baths" defaultValue={baths || ""}>
          <option value="">Any baths</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
        </select>
        <select name="furnished" defaultValue={furnished}>
          <option value="">Any furnishing</option><option value="FULLY_FURNISHED">Fully furnished</option><option value="SEMI_FURNISHED">Semi furnished</option><option value="UNFURNISHED">Unfurnished</option><option value="NOT_APPLICABLE">Not applicable</option>
        </select>
        <input name="areaMin" type="number" defaultValue={areaMin || ""} placeholder="Min size sqm" />
        <input name="areaMax" type="number" defaultValue={areaMax || ""} placeholder="Max size sqm" />
        <input name="landMin" type="number" defaultValue={landMin || ""} placeholder="Min land sqm" />
        <input name="landMax" type="number" defaultValue={landMax || ""} placeholder="Max land sqm" />
        <select name="featured" defaultValue={params.featured ?? ""}>
          <option value="">Featured: all</option><option value="true">Featured only</option>
        </select>
        <select name="sort" defaultValue={sort}>
          <option value="featured">Featured</option><option value="newest">Newest</option><option value="price_asc">Price: Low to high</option><option value="price_desc">Price: High to low</option>
        </select>
        <button className="btn btn-primary" type="submit" data-track-event="apply_filter" data-track-label="listings-filter-apply">Apply</button>
        <Link href="/listings" className="btn btn-ghost">Reset</Link>
      </form>

      {hasFilters && <p className="muted">Active filters applied. Use reset to return to full inventory.</p>}

      {listings.length ? (
        <>
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <button className="btn btn-ghost" type="button" data-cta="listings-load-more">Load more</button>
            <button className="btn btn-ghost" type="button" data-cta="listings-save-search">Save search</button>
          </div>
        </>
      ) : inventoryState === "unavailable" ? (
        <article className="empty-state">
          <h3>Inventory is temporarily unavailable</h3>
          <p>Our listing feed is being refreshed. Please try again shortly or contact our team for current verified opportunities.</p>
          <Link href="/contact" className="btn btn-primary">Request live assistance</Link>
        </article>
      ) : (
        <article className="empty-state">
          <h3>No listings matched this filter set</h3>
          <p>Try removing one or two constraints, or return to the verified default inventory.</p>
          <Link href="/listings" className="btn btn-ghost">Back to full inventory</Link>
        </article>
      )}
    </section>
  );
}
