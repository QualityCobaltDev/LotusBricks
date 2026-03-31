import { siteConfig } from "@/lib/site-config";

export type PlanKey = "tier1" | "tier2" | "tier3" | "custom";

export type PlanConfig = {
  key: PlanKey;
  name: string;
  recurringMonthlyUsd: number | null;
  oneTimeSignupFeeUsd: number;
  listingLimit: number | null;
  photosPerListing: number;
  videosPerListing: number;
  isPublic: boolean;
  isContactOnly: boolean;
  ctaLabel: string;
  ctaHref: string;
  badge?: string;
  featured?: boolean;
  notes?: string;
};

const LEGACY_RECURRING_PRICES_USD = {
  tier1: 29,
  tier2: 79,
  tier3: 199
} as const;

const PRICE_INCREASE_MULTIPLIER = 1.5;
const STANDARD_SIGNUP_FEE_USD = 50;
const PHOTOS_PER_LISTING = 10;
const VIDEOS_PER_LISTING = 2;

function withPriceIncrease(price: number) {
  return Number((price * PRICE_INCREASE_MULTIPLIER).toFixed(2));
}

export const STANDARD_PLAN_KEYS: PlanKey[] = ["tier1", "tier2", "tier3"];

export const planConfig: Record<PlanKey, PlanConfig> = {
  tier1: {
    key: "tier1",
    name: "Tier 1",
    recurringMonthlyUsd: withPriceIncrease(LEGACY_RECURRING_PRICES_USD.tier1),
    oneTimeSignupFeeUsd: STANDARD_SIGNUP_FEE_USD,
    listingLimit: 1,
    photosPerListing: PHOTOS_PER_LISTING,
    videosPerListing: VIDEOS_PER_LISTING,
    isPublic: true,
    isContactOnly: false,
    ctaLabel: "Start Tier 1",
    ctaHref: "/contact?plan=tier1&inquiry=standard-signup",
    notes: "Ideal for independent owners testing demand."
  },
  tier2: {
    key: "tier2",
    name: "Tier 2",
    recurringMonthlyUsd: withPriceIncrease(LEGACY_RECURRING_PRICES_USD.tier2),
    oneTimeSignupFeeUsd: STANDARD_SIGNUP_FEE_USD,
    listingLimit: 3,
    photosPerListing: PHOTOS_PER_LISTING,
    videosPerListing: VIDEOS_PER_LISTING,
    isPublic: true,
    isContactOnly: false,
    featured: true,
    badge: "Best value",
    ctaLabel: "Choose Tier 2",
    ctaHref: "/contact?plan=tier2&inquiry=standard-signup",
    notes: "Balanced plan for growing landlords and teams."
  },
  tier3: {
    key: "tier3",
    name: "Tier 3",
    recurringMonthlyUsd: withPriceIncrease(LEGACY_RECURRING_PRICES_USD.tier3),
    oneTimeSignupFeeUsd: STANDARD_SIGNUP_FEE_USD,
    listingLimit: 10,
    photosPerListing: PHOTOS_PER_LISTING,
    videosPerListing: VIDEOS_PER_LISTING,
    isPublic: true,
    isContactOnly: false,
    ctaLabel: "Scale with Tier 3",
    ctaHref: "/contact?plan=tier3&inquiry=standard-signup",
    notes: "For high-volume operators needing up to 10 active listings."
  },
  custom: {
    key: "custom",
    name: "Custom Tier",
    recurringMonthlyUsd: null,
    oneTimeSignupFeeUsd: 0,
    listingLimit: null,
    photosPerListing: PHOTOS_PER_LISTING,
    videosPerListing: VIDEOS_PER_LISTING,
    isPublic: true,
    isContactOnly: true,
    badge: "Enterprise",
    ctaLabel: "Speak to Sales",
    ctaHref: "/contact?plan=custom&inquiry=more-than-10-listings",
    notes: "Tailored for agencies, developers, and portfolios that need more than 10 listings. Pricing varies by requirements."
  }
};

export const publicPlans = Object.values(planConfig).filter((plan) => plan.isPublic);

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: value % 1 === 0 ? 0 : 2 }).format(value);
}

export function formatRecurring(plan: PlanConfig) {
  if (plan.recurringMonthlyUsd === null) return "Pricing Varies";
  return `${formatUsd(plan.recurringMonthlyUsd)}/month`;
}

export function resolvePlan(input: string | null | undefined): PlanConfig {
  if (!input) return planConfig.custom;
  return planConfig[input as PlanKey] ?? planConfig.custom;
}

export function getCheckoutBreakdown(plan: PlanConfig, isNewSignup: boolean) {
  const recurring = plan.recurringMonthlyUsd ?? 0;
  const signupFee = isNewSignup && !plan.isContactOnly ? plan.oneTimeSignupFeeUsd : 0;
  return {
    recurring,
    signupFee,
    totalDueToday: recurring + signupFee,
    currency: "USD",
    notes: isNewSignup
      ? "One-time $50 sign-up fee applies to all new standard subscriptions."
      : "Signup fee is not charged on renewals or existing subscriptions."
  };
}


export function getPlanForRole(role: string): PlanConfig {
  if (role === "DEVELOPER" || role === "AGENT_PARTNER") return planConfig.tier3;
  if (role === "LANDLORD") return planConfig.tier2;
  if (role === "SELLER") return planConfig.tier1;
  return planConfig.tier1;
}

export function listingCapMessage(used: number, plan: PlanConfig) {
  if (plan.listingLimit === null) return "Custom Tier active.";
  if (used < plan.listingLimit) return `${used}/${plan.listingLimit} listings used.`;
  if (plan.key === "tier3") return "Need more than 10 listings? Contact us for a Custom Tier.";
  return `Listing cap reached (${used}/${plan.listingLimit}). Upgrade your plan to publish more listings.`;
}
export const customTierContactSummary = `Need more than 10 listings? Contact us at ${siteConfig.contactEmail} or ${siteConfig.contactPhoneDisplay} for a tailored Custom Tier.`;
