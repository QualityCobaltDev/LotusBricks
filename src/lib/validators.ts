import { z } from "zod";
import { getPlanByKey } from "@/lib/plans";

const maxPhotos = getPlanByKey("TIER_1").photosPerListing;
const maxVideos = getPlanByKey("TIER_1").videosPerListing;

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8), role: z.enum(["ADMIN", "CUSTOMER"]).optional() });
export const registerSchema = z.object({ fullName: z.string().min(2), email: z.string().email(), password: z.string().min(8), selectedPlan: z.string().optional().default("TIER_1") });
export const listingSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3),
  title: z.string().min(3),
  summary: z.string().min(10),
  description: z.string().min(20),
  city: z.string().min(2),
  district: z.string().min(2),
  priceUsd: z.coerce.number().int().positive(),
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  areaSqm: z.coerce.number().int().positive(),
  listingType: z.enum(["SALE", "RENT", "COMMERCIAL", "LAND", "LUXURY", "INVESTMENT"]).optional(),
  category: z.enum(["VILLA", "CONDO", "APARTMENT", "TOWNHOUSE", "PENTHOUSE", "OFFICE", "SHOPHOUSE", "LAND", "WAREHOUSE"]).optional(),
  availability: z.enum(["AVAILABLE", "RESERVED", "SOLD", "RENTED", "UNDER_OFFER"]).optional(),
  country: z.string().optional(),
  commune: z.string().optional(),
  streetAddress: z.string().optional(),
  mapLabel: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  neighborhoodSummary: z.string().optional(),
  currency: z.string().optional(),
  priceSuffix: z.string().optional(),
  originalPriceUsd: z.coerce.number().int().positive().optional(),
  negotiable: z.coerce.boolean().optional(),
  serviceFees: z.string().optional(),
  annualManagementFee: z.string().optional(),
  depositTerms: z.string().optional(),
  paymentTerms: z.string().optional(),
  landAreaSqm: z.coerce.number().int().nonnegative().optional(),
  floors: z.coerce.number().int().nonnegative().optional(),
  parkingSpaces: z.coerce.number().int().nonnegative().optional(),
  furnishing: z.enum(["FULLY_FURNISHED", "SEMI_FURNISHED", "UNFURNISHED", "NOT_APPLICABLE"]).optional(),
  titleType: z.string().optional(),
  yearBuilt: z.coerce.number().int().optional(),
  renovatedYear: z.coerce.number().int().optional(),
  orientation: z.string().optional(),
  propertyCondition: z.string().optional(),
  heroDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  keySellingPoints: z.array(z.string()).optional(),
  idealFor: z.array(z.string()).optional(),
  neighborhoodBenefits: z.array(z.string()).optional(),
  investmentHighlights: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  indoorFeatures: z.array(z.string()).optional(),
  outdoorFeatures: z.array(z.string()).optional(),
  securityFeatures: z.array(z.string()).optional(),
  lifestyleFeatures: z.array(z.string()).optional(),
  floorPlanImage: z.string().optional(),
  brochurePdf: z.string().optional(),
  availabilityDate: z.string().datetime().optional(),
  viewingAvailability: z.string().optional(),
  agentName: z.string().optional(),
  agentRole: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  whatsappAvailable: z.coerce.boolean().optional(),
  telegramAvailable: z.coerce.boolean().optional(),
  enquirySubjectTemplate: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  openGraphImage: z.string().optional(),
  structuredData: z.any().optional(),
  badges: z.array(z.string()).optional(),
  breadcrumbs: z.array(z.string()).optional(),
  similarListings: z.array(z.string()).optional(),
  sortOrder: z.coerce.number().int().optional(),
  featured: z.coerce.boolean().optional().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  imageUrls: z.array(z.string().url()).max(maxPhotos).optional().default([]),
  videoUrls: z.array(z.string().url()).max(maxVideos).optional().default([]),
  imageUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal(""))
}).superRefine((payload, ctx) => {
  const legacyImages = payload.imageUrl ? [payload.imageUrl] : [];
  const legacyVideos = payload.videoUrl ? [payload.videoUrl] : [];
  const images = payload.imageUrls.length ? payload.imageUrls : legacyImages;
  const videos = payload.videoUrls.length ? payload.videoUrls : legacyVideos;

  if (images.length > maxPhotos) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["imageUrls"], message: `Maximum ${maxPhotos} photos per listing.` });
  }

  if (videos.length > maxVideos) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["videoUrls"], message: `Maximum ${maxVideos} videos per listing.` });
  }
});

export const inquirySchema = z.object({
  listingId: z.string().min(1).optional().or(z.literal("")),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  companyName: z.string().optional(),
  selectedPlan: z.string().optional(),
  inquiryType: z.enum(["LISTING", "CUSTOM_PLAN", "GENERAL", "CONTACT", "VALUATION", "LISTING_SUBMISSION"]).optional().default("LISTING"),
  requestedListings: z.coerce.number().int().positive().optional(),
  sourcePage: z.string().optional(),
  honeypot: z.string().optional().default(""),
  message: z.string().min(10)
});

export const contactSettingsSchema = z.object({
  phoneDisplay: z.literal("(+855) 011 389 625"),
  phoneHref: z.literal("tel:+85511389625"),
  email: z.literal("contact@rightbricks.online"),
  emailHref: z.literal("mailto:contact@rightbricks.online"),
  whatsappHref: z.literal("https://wa.me/85511389625").optional(),
  telegramHref: z.literal("https://t.me/").optional(),
  supportHours: z.string().optional(),
  supportAddress: z.string().optional()
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "VIEWING_SCHEDULED", "NEGOTIATION", "WON", "LOST", "ARCHIVED"]),
  notes: z.string().optional(),
  assignedTo: z.string().optional()
});


export const pricingSettingsSchema = z.record(z.enum(["TIER_1", "TIER_2", "TIER_3", "CUSTOM"]), z.object({
  name: z.string().min(2),
  recurringMonthlyUsd: z.number().nullable(),
  oneTimeSignupFeeUsd: z.number().min(0),
  ctaLabel: z.string().min(2),
  ctaHref: z.string().min(1),
  badge: z.string().optional(),
  blurb: z.string().optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional()
}));


export const passwordResetRequestSchema = z.object({ email: z.string().email() });
export const passwordResetConfirmSchema = z.object({ token: z.string().min(20), password: z.string().min(8) });
