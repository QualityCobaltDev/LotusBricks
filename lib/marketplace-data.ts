export type ListingIntent = "buy" | "rent";
export type ListingSource = "agent" | "owner" | "developer";

export type ListingSummary = {
  id: string;
  slug: string;
  title: string;
  intent: ListingIntent;
  propertyType: "Apartment" | "Condo" | "Villa" | "Shophouse" | "Land";
  city: string;
  district: string;
  neighborhood: string;
  addressLine: string;
  priceUsd: number;
  bedrooms: number | null;
  bathrooms: number | null;
  floorAreaSqm: number | null;
  landAreaSqm: number | null;
  furnishing: "Furnished" | "Semi-furnished" | "Unfurnished";
  amenities: string[];
  isVerified: boolean;
  isFeatured: boolean;
  isNew: boolean;
  source: ListingSource;
  coverImageUrl: string;
  gallery: string[];
  description: string;
  videoTourUrl?: string;
  virtualTourUrl?: string;
  ownerName: string;
  ownerRole: "Owner" | "Agent" | "Developer";
  ownerPhone: string;
};

export type ListingFilters = {
  intent: ListingIntent;
  q?: string;
  city?: string;
  district?: string;
  neighborhood?: string;
  propertyType?: ListingSummary["propertyType"] | "any";
  minPriceUsd?: number;
  maxPriceUsd?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  parking?: boolean;
  balcony?: boolean;
  petFriendly?: boolean;
  pool?: boolean;
  gym?: boolean;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  newOnly?: boolean;
  source?: ListingSource | "any";
  sort?: "relevance" | "newest" | "price_asc" | "price_desc" | "featured";
};

const LISTINGS: ListingSummary[] = [
  {
    id: "l1", slug: "modern-2br-condo-bkk1-phnom-penh", title: "Modern 2BR Condo with Balcony in BKK1", intent: "buy", propertyType: "Condo", city: "Phnom Penh", district: "BKK1", neighborhood: "Tonle Bassac", addressLine: "Street 294, BKK1", priceUsd: 148000, bedrooms: 2, bathrooms: 2, floorAreaSqm: 86, landAreaSqm: null, furnishing: "Furnished", amenities: ["balcony", "gym", "parking", "pool"], isVerified: true, isFeatured: true, isNew: true, source: "agent", coverImageUrl: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80", gallery: ["https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80"], description: "Turn-key condo in central BKK1 with secure parking, gym access, and strong rental demand from expat tenants.", videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", ownerName: "Sokha Realty", ownerRole: "Agent", ownerPhone: "+855 12 888 210"
  },
  {
    id: "l2", slug: "riverside-shophouse-daun-penh", title: "Riverside Shophouse Near Night Market", intent: "buy", propertyType: "Shophouse", city: "Phnom Penh", district: "Daun Penh", neighborhood: "Riverside", addressLine: "Sisowath Quay", priceUsd: 395000, bedrooms: 4, bathrooms: 5, floorAreaSqm: 260, landAreaSqm: 95, furnishing: "Unfurnished", amenities: ["balcony", "parking"], isVerified: true, isFeatured: false, isNew: false, source: "owner", coverImageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80", gallery: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"], description: "Mixed-use shophouse positioned for F&B, boutique retail, or serviced apartment conversion.", ownerName: "Dara Chhun", ownerRole: "Owner", ownerPhone: "+855 11 330 812"
  },
  {
    id: "l3", slug: "new-villa-siem-reap-ring-road", title: "New Build Family Villa by Ring Road", intent: "buy", propertyType: "Villa", city: "Siem Reap", district: "Svay Dangkum", neighborhood: "Ring Road", addressLine: "NR6 Ring Road", priceUsd: 189000, bedrooms: 3, bathrooms: 3, floorAreaSqm: 178, landAreaSqm: 310, furnishing: "Semi-furnished", amenities: ["parking", "pet-friendly"], isVerified: false, isFeatured: true, isNew: true, source: "developer", coverImageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80", gallery: ["https://images.unsplash.com/photo-1572120360610-d971b9b63956?auto=format&fit=crop&w=1200&q=80"], description: "Quiet residential villa with private garden and parking, suitable for local families and retirees.", ownerName: "Angkor Habitat", ownerRole: "Developer", ownerPhone: "+855 92 551 990"
  },
  {
    id: "l4", slug: "studio-apartment-toul-tompoung-rent", title: "Furnished Studio Apartment in Toul Tompoung", intent: "rent", propertyType: "Apartment", city: "Phnom Penh", district: "Toul Tompoung", neighborhood: "Russian Market", addressLine: "Street 155", priceUsd: 420, bedrooms: 1, bathrooms: 1, floorAreaSqm: 42, landAreaSqm: null, furnishing: "Furnished", amenities: ["gym", "balcony"], isVerified: true, isFeatured: false, isNew: true, source: "agent", coverImageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80", gallery: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"], description: "Affordable, fully furnished studio with weekly cleaning, ideal for professionals and digital nomads.", ownerName: "Urban Living KH", ownerRole: "Agent", ownerPhone: "+855 10 667 122"
  },
  {
    id: "l5", slug: "3br-penthouse-rent-chroy-changvar", title: "3BR Penthouse with Mekong Views", intent: "rent", propertyType: "Condo", city: "Phnom Penh", district: "Chroy Changvar", neighborhood: "Mekong Riverside", addressLine: "National Road 6A", priceUsd: 1600, bedrooms: 3, bathrooms: 3, floorAreaSqm: 180, landAreaSqm: null, furnishing: "Furnished", amenities: ["pool", "gym", "parking", "balcony"], isVerified: true, isFeatured: true, isNew: false, source: "agent", coverImageUrl: "https://images.unsplash.com/photo-1616594039964-3f63b43e6b1f?auto=format&fit=crop&w=1200&q=80", gallery: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"], description: "Premium penthouse with river views, fitness center access, and 24/7 security concierge.", ownerName: "Mekong Prime Estates", ownerRole: "Agent", ownerPhone: "+855 97 770 450"
  },
  {
    id: "l6", slug: "family-villa-rent-siem-reap", title: "Garden Villa for Long-term Rent", intent: "rent", propertyType: "Villa", city: "Siem Reap", district: "Sala Kamreuk", neighborhood: "Wat Bo", addressLine: "Wat Bo Extension", priceUsd: 950, bedrooms: 3, bathrooms: 2, floorAreaSqm: 150, landAreaSqm: 420, furnishing: "Unfurnished", amenities: ["parking", "pet-friendly"], isVerified: false, isFeatured: false, isNew: true, source: "owner", coverImageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", gallery: ["https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80"], description: "Peaceful villa with mature garden and pet-friendly policy, built for long-stay families.", ownerName: "Sreypov Lim", ownerRole: "Owner", ownerPhone: "+855 61 421 904"
  }
];

export const MARKET_STATS = { verifiedListings: 1482, averageResponseHours: 3, managedDistricts: 24 } as const;

export function getListings(filters: ListingFilters): ListingSummary[] {
  let rows = LISTINGS.filter((listing) => {
    if (listing.intent !== filters.intent) return false;
    if (filters.q && !`${listing.title} ${listing.city} ${listing.district} ${listing.neighborhood}`.toLowerCase().includes(filters.q.toLowerCase())) return false;
    if (filters.city && filters.city !== "any" && listing.city !== filters.city) return false;
    if (filters.district && listing.district !== filters.district) return false;
    if (filters.propertyType && filters.propertyType !== "any" && listing.propertyType !== filters.propertyType) return false;
    if (filters.minPriceUsd && listing.priceUsd < filters.minPriceUsd) return false;
    if (filters.maxPriceUsd && listing.priceUsd > filters.maxPriceUsd) return false;
    if (filters.bedrooms && (listing.bedrooms ?? 0) < filters.bedrooms) return false;
    if (filters.bathrooms && (listing.bathrooms ?? 0) < filters.bathrooms) return false;
    if (filters.furnished && listing.furnishing === "Unfurnished") return false;
    if (filters.verifiedOnly && !listing.isVerified) return false;
    if (filters.featuredOnly && !listing.isFeatured) return false;
    if (filters.newOnly && !listing.isNew) return false;
    if (filters.source && filters.source !== "any" && listing.source !== filters.source) return false;
    const flags: Array<[boolean | undefined, string]> = [[filters.parking, "parking"], [filters.balcony, "balcony"], [filters.petFriendly, "pet-friendly"], [filters.pool, "pool"], [filters.gym, "gym"]];
    return flags.every(([enabled, key]) => !enabled || listing.amenities.includes(key));
  });

  switch (filters.sort) {
    case "newest": rows = [...rows].sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
    case "price_asc": rows = [...rows].sort((a, b) => a.priceUsd - b.priceUsd); break;
    case "price_desc": rows = [...rows].sort((a, b) => b.priceUsd - a.priceUsd); break;
    case "featured": rows = [...rows].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured)); break;
  }

  return rows;
}

export const getListingBySlug = (slug: string) => LISTINGS.find((listing) => listing.slug === slug) ?? null;
export const getRelatedListings = (listing: ListingSummary) => LISTINGS.filter((candidate) => candidate.slug !== listing.slug && candidate.intent === listing.intent && candidate.city === listing.city).slice(0, 3);
export const getFeaturedListings = () => LISTINGS.filter((listing) => listing.isFeatured).slice(0, 4);
export const getCitiesForIntent = (intent: ListingIntent) => Array.from(new Set(LISTINGS.filter((l) => l.intent === intent).map((l) => l.city)));
export const getAllListings = () => LISTINGS;
