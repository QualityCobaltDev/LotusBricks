export const SEO_REGIONS = [
  { slug: "phnom-penh", name: "Phnom Penh" },
  { slug: "siem-reap", name: "Siem Reap" },
  { slug: "sihanoukville", name: "Sihanoukville" },
  { slug: "battambang", name: "Battambang" }
] as const;

export const SEO_CATEGORIES = [
  { slug: "condos", name: "Condos", listingCategory: "CONDO" },
  { slug: "villas", name: "Villas", listingCategory: "VILLA" },
  { slug: "apartments", name: "Apartments", listingCategory: "APARTMENT" },
  { slug: "commercial", name: "Commercial Spaces", listingCategory: "OFFICE" },
  { slug: "land", name: "Land", listingCategory: "LAND" }
] as const;

export function getRegionBySlug(slug: string) {
  return SEO_REGIONS.find((region) => region.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return SEO_CATEGORIES.find((category) => category.slug === slug);
}

export function getDiscoverPath(regionSlug: string, categorySlug: string) {
  return `/discover/${regionSlug}/${categorySlug}`;
}

export function buildListingsFilterHref(input: { regionName?: string; categoryKey?: string }) {
  const params = new URLSearchParams();
  if (input.regionName) params.set("city", input.regionName);
  if (input.categoryKey) params.set("category", input.categoryKey);
  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}
