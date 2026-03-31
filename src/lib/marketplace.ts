export type ListingType = "buy" | "rent";

export type Listing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ListingType;
  propertyType: "Condo" | "Villa" | "Apartment" | "Land" | "Commercial";
  city: string;
  district: string;
  address: string;
  price: number;
  currency: "USD";
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  landSqm?: number;
  featured: boolean;
  published: boolean;
  images: string[];
  videos: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
};

export type Inquiry = {
  id: string;
  listingSlug?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

const now = new Date().toISOString();

let listings: Listing[] = [
  {
    id: "lst_1",
    slug: "bkk1-premium-condo-phnom-penh",
    title: "Premium BKK1 Sky Condo",
    description: "High-floor condo with skyline views, concierge, and private gym access in BKK1.",
    type: "buy",
    propertyType: "Condo",
    city: "Phnom Penh",
    district: "BKK1",
    address: "Street 308, BKK1",
    price: 285000,
    currency: "USD",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 108,
    featured: true,
    published: true,
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
    ],
    videos: ["https://example.com/video-tour-1"],
    amenities: ["Pool", "Gym", "24/7 Security", "Parking"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "lst_2",
    slug: "riverside-rental-apartment-daun-penh",
    title: "Riverside Furnished Apartment",
    description: "Move-in ready apartment ideal for expats and professionals near key offices.",
    type: "rent",
    propertyType: "Apartment",
    city: "Phnom Penh",
    district: "Daun Penh",
    address: "Sisowath Quay",
    price: 1200,
    currency: "USD",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqm: 64,
    featured: true,
    published: true,
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6"
    ],
    videos: ["https://example.com/video-tour-2"],
    amenities: ["Balcony", "Lift", "Furnished", "Backup Power"],
    createdAt: now,
    updatedAt: now
  }
];

let inquiries: Inquiry[] = [];

export function getListings(type?: ListingType) {
  const base = listings.filter((item) => item.published);
  return type ? base.filter((item) => item.type === type) : base;
}

export function getFeaturedListings() {
  return listings.filter((item) => item.featured && item.published);
}

export function getListingBySlug(slug: string) {
  return listings.find((item) => item.slug === slug && item.published);
}

export function getAdminListings() {
  return listings;
}

export function upsertListing(input: Listing) {
  const idx = listings.findIndex((item) => item.id === input.id);
  if (idx >= 0) {
    listings[idx] = { ...input, updatedAt: new Date().toISOString() };
  } else {
    listings = [{ ...input, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...listings];
  }
}

export function deleteListing(id: string) {
  listings = listings.filter((item) => item.id !== id);
}

export function createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt">) {
  const next = { id: `inq_${Date.now()}`, createdAt: new Date().toISOString(), ...inquiry };
  inquiries = [next, ...inquiries];
  return next;
}

export function getInquiries() {
  return inquiries;
}
