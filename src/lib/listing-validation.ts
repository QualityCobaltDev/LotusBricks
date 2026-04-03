import type { ListingIntent, ListingType, PriceFrequency, PropertyCategory, VerificationState } from "@prisma/client";

type ListingLike = {
  title: string;
  listingType: ListingType;
  listingIntent: ListingIntent;
  category: PropertyCategory;
  priceFrequency: PriceFrequency;
  priceUsd: number;
  city?: string | null;
  district?: string | null;
  summary?: string | null;
  description?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqm?: number | null;
  mediaCount?: number;
  mediaVerified?: boolean;
  docsReviewed?: boolean;
  locationConfirmed?: boolean;
  categoryOverrideJustification?: string | null;
  verificationState?: VerificationState;
};

const RENT_FREQUENCIES = new Set<PriceFrequency>(["MONTHLY", "WEEKLY", "DAILY", "YEARLY"]);
const ONE_TIME_FREQUENCIES = new Set<PriceFrequency>(["TOTAL"]);

export type ListingIssue = { path: string; message: string };

export function getIntentFromListingType(listingType: ListingType): ListingIntent {
  if (listingType === "RENT") return "RENT";
  if (listingType === "INVESTMENT") return "INVESTMENT";
  if (listingType === "COMMERCIAL") return "LEASE";
  return "SALE";
}

export function validateListingConsistency(input: ListingLike): ListingIssue[] {
  const issues: ListingIssue[] = [];
  const lowered = input.title.toLowerCase();

  if (lowered.includes("villa") && input.category !== "VILLA" && !input.categoryOverrideJustification?.trim()) {
    issues.push({ path: "category", message: "Title suggests villa, but category is not VILLA. Add justification to allow override." });
  }

  if (lowered.includes("condo") && !["CONDO", "APARTMENT", "PENTHOUSE"].includes(input.category) && !input.categoryOverrideJustification?.trim()) {
    issues.push({ path: "category", message: "Title suggests condo, but category is not condo-compatible." });
  }

  if (input.listingIntent === "RENT" || input.listingIntent === "LEASE") {
    if (!RENT_FREQUENCIES.has(input.priceFrequency)) {
      issues.push({ path: "priceFrequency", message: "Rent/lease listings must use recurring price frequency (daily/weekly/monthly/yearly)." });
    }
  } else if (!ONE_TIME_FREQUENCIES.has(input.priceFrequency)) {
    issues.push({ path: "priceFrequency", message: "Sale/investment listings must use one-time total pricing." });
  }

  if (input.listingIntent === "RENT" && input.listingType === "SALE") {
    issues.push({ path: "listingType", message: "Listing type SALE cannot be used with RENT intent." });
  }

  if (input.listingIntent === "SALE" && input.listingType === "RENT") {
    issues.push({ path: "listingType", message: "Listing type RENT cannot be used with SALE intent." });
  }

  if (input.priceUsd <= 0) {
    issues.push({ path: "priceUsd", message: "Price must be greater than zero." });
  }

  return issues;
}

export function getVerificationReadiness(input: ListingLike) {
  const checks: { key: string; passed: boolean; label: string }[] = [
    { key: "core", passed: Boolean(input.title && input.summary && input.description), label: "Core content complete" },
    { key: "location", passed: Boolean(input.city && input.district), label: "Location metadata complete" },
    { key: "specs", passed: Boolean((input.bedrooms ?? 0) >= 0 && (input.bathrooms ?? 0) >= 0 && (input.areaSqm ?? 0) > 0), label: "Property specs complete" },
    { key: "media", passed: (input.mediaCount ?? 0) > 0, label: "Media attached" },
    { key: "mediaVerified", passed: Boolean(input.mediaVerified), label: "Media verified" },
    { key: "docs", passed: Boolean(input.docsReviewed), label: "Ownership/documentation reviewed" },
    { key: "locConfirmed", passed: Boolean(input.locationConfirmed), label: "Location confirmed" }
  ];

  const passed = checks.filter((item) => item.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  const readyForVerified = checks.every((item) => item.passed);

  return { score, readyForVerified, checks };
}
