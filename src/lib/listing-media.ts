import { Prisma, PropertyCategory } from "@prisma/client";
import { STOCK_IMAGES, STOCK_VIDEOS, type StockMediaCategory } from "@/lib/stock-media";

export type ListingMediaInput = {
  id?: string;
  kind?: string | null;
  url?: string | null;
  alt?: string | null;
  caption?: string | null;
  thumbnail?: string | null;
  title?: string | null;
  description?: string | null;
  isPrimary?: boolean | null;
  sortOrder?: number | null;
  sourceType?: string | null;
};

export type NormalizedListingMedia = {
  id?: string;
  type: "image" | "video";
  url: string;
  altText: string;
  caption: string | null;
  posterUrl: string | null;
  title: string | null;
  description: string | null;
  isPrimary: boolean;
  sortOrder: number;
  sourceType: "seed" | "upload";
};

export const MEDIA_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80";

const CATEGORY_TO_STOCK: Record<PropertyCategory, StockMediaCategory> = {
  CONDO: "condo",
  VILLA: "villa",
  APARTMENT: "apartment",
  TOWNHOUSE: "townhouse",
  PENTHOUSE: "penthouse",
  OFFICE: "office",
  SHOPHOUSE: "shophouse",
  LAND: "land",
  WAREHOUSE: "warehouse"
};

const seededSlugOrder = [
  "modern-riverside-condo-balcony-daun-penh",
  "luxury-family-villa-private-garden-bkk",
  "affordable-city-apartment-near-business-district",
  "contemporary-townhouse-gated-community-sen-sok",
  "high-floor-penthouse-skyline-views-tonle-bassac",
  "commercial-shophouse-busy-main-road-toul-kork",
  "serviced-office-space-ready-bkk1",
  "residential-development-land-plot-chbar-ampov",
  "modern-warehouse-office-component-por-sen-chey",
  "investment-condo-russian-market-rental-appeal"
] as const;

const featuredVideoSlugs = new Set([
  "luxury-family-villa-private-garden-bkk",
  "high-floor-penthouse-skyline-views-tonle-bassac",
  "serviced-office-space-ready-bkk1"
]);

const asUrl = (value?: string | null) => (value ?? "").trim();

function rotate<T>(arr: readonly T[], offset: number): T[] {
  if (!arr.length) return [];
  const safeOffset = ((offset % arr.length) + arr.length) % arr.length;
  return [...arr.slice(safeOffset), ...arr.slice(0, safeOffset)];
}

export function buildStockMediaForListing(args: {
  slug: string;
  title: string;
  category: PropertyCategory;
  featured?: boolean;
}): Omit<Prisma.ListingMediaCreateManyInput, "listingId">[] {
  const stockCategory = CATEGORY_TO_STOCK[args.category] ?? "condo";
  const categoryImages = STOCK_IMAGES[stockCategory];
  const slugIndex = Math.max(0, seededSlugOrder.indexOf(args.slug as (typeof seededSlugOrder)[number]));
  const rotated = rotate(categoryImages, slugIndex);

  const imageCount = args.featured ? 6 : 4;
  const images: Omit<Prisma.ListingMediaCreateManyInput, "listingId">[] = Array.from({ length: imageCount }, (_, index) => {
    const url = rotated[index % rotated.length];
    return {
      kind: "image",
      url,
      alt: `${args.title} - image ${index + 1}`,
      isPrimary: index === 0,
      sortOrder: index + 1,
      sourceType: "seed"
    };
  });

  const shouldAddVideo = args.featured || featuredVideoSlugs.has(args.slug);
  if (shouldAddVideo) {
    images.push({
      kind: "video",
      url: STOCK_VIDEOS[stockCategory][0],
      title: `${args.title} video tour`,
      description: "YouTube property walkthrough",
      sortOrder: images.length + 1,
      sourceType: "seed"
    });
  }

  return images;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return url;
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function normalizeListingMedia(items: ListingMediaInput[] | null | undefined, listingTitle: string): NormalizedListingMedia[] {
  const normalized = (items ?? [])
    .map((item, index): NormalizedListingMedia | null => {
      const url = asUrl(item.url);
      if (!url) return null;
      const embed = getYouTubeEmbedUrl(url);
      const rawKind = (item.kind ?? "image").toLowerCase();
      const type = rawKind === "video" || Boolean(embed) ? "video" : "image";
      return {
        id: item.id,
        type,
        url,
        altText: asUrl(item.alt) || `${listingTitle} ${type}`,
        caption: item.caption ?? null,
        posterUrl: asUrl(item.thumbnail) || null,
        title: item.title ?? null,
        description: item.description ?? null,
        isPrimary: Boolean(item.isPrimary),
        sortOrder: item.sortOrder ?? index + 1,
        sourceType: item.sourceType === "seed" ? "seed" : "upload"
      };
    })
    .filter((item): item is NormalizedListingMedia => Boolean(item))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (normalized.length > 0 && !normalized.some((item) => item.isPrimary)) normalized[0].isPrimary = true;
  return normalized;
}

export function getPrimaryMedia(media: NormalizedListingMedia[]): NormalizedListingMedia | null {
  return media.find((item) => item.isPrimary) ?? media[0] ?? null;
}

export function getGalleryMedia(media: NormalizedListingMedia[]): NormalizedListingMedia[] {
  return media.filter((item) => item.type === "image");
}

export function hasVideoMedia(media: NormalizedListingMedia[]): boolean {
  return media.some((item) => item.type === "video");
}

export function getCardThumbnail(media: NormalizedListingMedia[]): string {
  const primary = getPrimaryMedia(media);
  const firstImage = media.find((item) => item.type === "image");
  return primary?.type === "image"
    ? primary.url
    : firstImage?.url ?? primary?.posterUrl ?? MEDIA_FALLBACK_IMAGE;
}

export const DEMO_LISTING_MEDIA: Record<string, Omit<Prisma.ListingMediaCreateManyInput, "listingId">[]> = {
  "modern-riverside-condo-balcony-daun-penh": buildStockMediaForListing({ slug: "modern-riverside-condo-balcony-daun-penh", title: "Modern Riverside Condo with Balcony", category: "CONDO", featured: true }),
  "luxury-family-villa-private-garden-bkk": buildStockMediaForListing({ slug: "luxury-family-villa-private-garden-bkk", title: "Luxury Family Villa with Private Garden", category: "VILLA", featured: true }),
  "affordable-city-apartment-near-business-district": buildStockMediaForListing({ slug: "affordable-city-apartment-near-business-district", title: "Affordable City Apartment Near Business District", category: "APARTMENT", featured: false }),
  "contemporary-townhouse-gated-community-sen-sok": buildStockMediaForListing({ slug: "contemporary-townhouse-gated-community-sen-sok", title: "Contemporary Townhouse in Gated Community", category: "TOWNHOUSE", featured: true }),
  "high-floor-penthouse-skyline-views-tonle-bassac": buildStockMediaForListing({ slug: "high-floor-penthouse-skyline-views-tonle-bassac", title: "High-Floor Penthouse with Skyline Views", category: "PENTHOUSE", featured: true }),
  "commercial-shophouse-busy-main-road-toul-kork": buildStockMediaForListing({ slug: "commercial-shophouse-busy-main-road-toul-kork", title: "Commercial Shophouse on Busy Main Road", category: "SHOPHOUSE", featured: false }),
  "serviced-office-space-ready-bkk1": buildStockMediaForListing({ slug: "serviced-office-space-ready-bkk1", title: "Serviced Office Space Ready for Immediate Use", category: "OFFICE", featured: true }),
  "residential-development-land-plot-chbar-ampov": buildStockMediaForListing({ slug: "residential-development-land-plot-chbar-ampov", title: "Residential Development Land Plot", category: "LAND", featured: false }),
  "modern-warehouse-office-component-por-sen-chey": buildStockMediaForListing({ slug: "modern-warehouse-office-component-por-sen-chey", title: "Modern Warehouse with Office Component", category: "WAREHOUSE", featured: false }),
  "investment-condo-russian-market-rental-appeal": buildStockMediaForListing({ slug: "investment-condo-russian-market-rental-appeal", title: "Investment Condo Unit with Strong Rental Appeal", category: "CONDO", featured: false })
};
