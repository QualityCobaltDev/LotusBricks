import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { db, isDatabaseConfigured } from "@/lib/db";
import { ListingCard } from "@/components/ui/listing-card";
import { logServerError } from "@/lib/observability";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "listings" });
  return buildMetadata({ title: t("title"), description: t("subtitle"), path: "/listings" });
}

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; min?: string; max?: string; beds?: string; baths?: string; city?: string; sort?: string; listingType?: string; category?: string; furnished?: string; featured?: string; areaMin?: string; areaMax?: string; landMin?: string; landMax?: string }>;
}) {
  const params = await searchParams;
  const t = await getTranslations("listings");
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
        include: { media: { select: { url: true, kind: true, thumbnail: true }, orderBy: { sortOrder: "asc" }, take: 8 } },
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
        <h1>{t("title")}</h1>
        <p className="muted">{t("subtitle")}</p>
      </div>

      <form className="filter-bar" method="GET" aria-label={t("filtersLabel")}>
        <input name="q" defaultValue={q} placeholder={t("searchPlaceholder")} />
        <input name="city" defaultValue={city} placeholder={t("cityPlaceholder")} />
        <input name="min" type="number" defaultValue={min || ""} placeholder={t("minUsd")} />
        <input name="max" type="number" defaultValue={max || ""} placeholder={t("maxUsd")} />
        <select name="listingType" defaultValue={listingType}>
          <option value="">{t("allTypes")}</option><option value="SALE">{t("forSale")}</option><option value="RENT">{t("forRent")}</option><option value="COMMERCIAL">{t("commercial")}</option><option value="LAND">{t("land")}</option><option value="LUXURY">{t("luxury")}</option><option value="INVESTMENT">{t("investment")}</option>
        </select>
        <select name="category" defaultValue={category}>
          <option value="">{t("allCategories")}</option><option value="VILLA">{t("villa")}</option><option value="CONDO">{t("condo")}</option><option value="APARTMENT">{t("apartment")}</option><option value="TOWNHOUSE">{t("townhouse")}</option><option value="PENTHOUSE">{t("penthouse")}</option><option value="OFFICE">{t("office")}</option><option value="SHOPHOUSE">{t("shophouse")}</option><option value="LAND">{t("land")}</option><option value="WAREHOUSE">{t("warehouse")}</option>
        </select>
        <select name="beds" defaultValue={beds || ""}>
          <option value="">{t("anyBeds")}</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
        </select>
        <select name="baths" defaultValue={baths || ""}>
          <option value="">{t("anyBaths")}</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
        </select>
        <select name="furnished" defaultValue={furnished}>
          <option value="">{t("anyFurnishing")}</option><option value="FULLY_FURNISHED">{t("fullyFurnished")}</option><option value="SEMI_FURNISHED">{t("semiFurnished")}</option><option value="UNFURNISHED">{t("unfurnished")}</option><option value="NOT_APPLICABLE">{t("notApplicable")}</option>
        </select>
        <input name="areaMin" type="number" defaultValue={areaMin || ""} placeholder={t("minSizeSqm")} />
        <input name="areaMax" type="number" defaultValue={areaMax || ""} placeholder={t("maxSizeSqm")} />
        <input name="landMin" type="number" defaultValue={landMin || ""} placeholder={t("minLandSqm")} />
        <input name="landMax" type="number" defaultValue={landMax || ""} placeholder={t("maxLandSqm")} />
        <select name="featured" defaultValue={params.featured ?? ""}>
          <option value="">{t("featuredAll")}</option><option value="true">{t("featuredOnly")}</option>
        </select>
        <select name="sort" defaultValue={sort}>
          <option value="featured">{t("sortFeatured")}</option><option value="newest">{t("sortNewest")}</option><option value="price_asc">{t("sortPriceLowHigh")}</option><option value="price_desc">{t("sortPriceHighLow")}</option>
        </select>
        <button className="btn btn-primary" type="submit" data-track-event="apply_filter" data-track-label="listings-filter-apply">{t("apply")}</button>
        <Link href="/listings" className="btn btn-ghost">{t("reset")}</Link>
      </form>

      {hasFilters && <p className="muted">{t("activeFilters")}</p>}

      {listings.length ? (
        <>
          <div className="listing-grid">
            {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <button className="btn btn-ghost" type="button" data-cta="listings-load-more">{t("loadMore")}</button>
            <button className="btn btn-ghost" type="button" data-cta="listings-save-search">{t("saveSearch")}</button>
          </div>
        </>
      ) : inventoryState === "unavailable" ? (
        <article className="empty-state">
          <h3>{t("unavailableTitle")}</h3>
          <p>{t("unavailableBody")}</p>
          <Link href="/contact" className="btn btn-primary">{t("requestLiveAssistance")}</Link>
        </article>
      ) : (
        <article className="empty-state">
          <h3>{t("noMatchTitle")}</h3>
          <p>{t("noMatchBody")}</p>
          <Link href="/listings" className="btn btn-ghost">{t("backToInventory")}</Link>
        </article>
      )}
    </section>
  );
}
