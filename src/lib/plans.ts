export type StandardPlanKey = "TIER_1" | "TIER_2" | "TIER_3";
export type PlanKey = StandardPlanKey | "CUSTOM";

export type PlanConfig = {
  key: PlanKey;
  name: string;
  recurringMonthlyUsd: number | null;
  oneTimeSignupFeeUsd: number;
  listingLimit: number | null;
  photosPerListing: number;
  videosPerListing: number;
  contactOnly: boolean;
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
  badge?: string;
  blurb?: string;
};

const SIGNUP_FEE_USD = 50;

// Existing standard prices in app were $29 and $99. Tier 3 had no fixed public price, so
// a baseline of $199 is used before applying the 50% increase.
const BASE_STANDARD_MONTHLY_USD: Record<StandardPlanKey, number> = {
  TIER_1: 29,
  TIER_2: 99,
  TIER_3: 199
};

const withIncrease = (value: number) => Number((value * 1.5).toFixed(2));

export const PLAN_CONFIG: Record<PlanKey, PlanConfig> = {
  TIER_1: {
    key: "TIER_1",
    name: "Tier 1",
    recurringMonthlyUsd: withIncrease(BASE_STANDARD_MONTHLY_USD.TIER_1),
    oneTimeSignupFeeUsd: SIGNUP_FEE_USD,
    listingLimit: 1,
    photosPerListing: 10,
    videosPerListing: 2,
    contactOnly: false,
    ctaLabel: "Choose Tier 1",
    ctaHref: "/contact?plan=tier-1"
  },
  TIER_2: {
    key: "TIER_2",
    name: "Tier 2",
    recurringMonthlyUsd: withIncrease(BASE_STANDARD_MONTHLY_USD.TIER_2),
    oneTimeSignupFeeUsd: SIGNUP_FEE_USD,
    listingLimit: 3,
    photosPerListing: 10,
    videosPerListing: 2,
    contactOnly: false,
    ctaLabel: "Choose Tier 2",
    ctaHref: "/contact?plan=tier-2",
    featured: true,
    badge: "Best Value"
  },
  TIER_3: {
    key: "TIER_3",
    name: "Tier 3",
    recurringMonthlyUsd: withIncrease(BASE_STANDARD_MONTHLY_USD.TIER_3),
    oneTimeSignupFeeUsd: SIGNUP_FEE_USD,
    listingLimit: 10,
    photosPerListing: 10,
    videosPerListing: 2,
    contactOnly: false,
    ctaLabel: "Choose Tier 3",
    ctaHref: "/contact?plan=tier-3"
  },
  CUSTOM: {
    key: "CUSTOM",
    name: "Custom Tier",
    recurringMonthlyUsd: null,
    oneTimeSignupFeeUsd: 0,
    listingLimit: null,
    photosPerListing: 10,
    videosPerListing: 2,
    contactOnly: true,
    ctaLabel: "Request Custom Plan",
    ctaHref: "/contact?plan=custom&tierNeeds=10-plus",
    badge: "Premium",
    blurb: "Tailored for agencies, developers, and portfolios needing more than 10 listings."
  }
};

export const PLAN_ORDER: PlanKey[] = ["TIER_1", "TIER_2", "TIER_3", "CUSTOM"];

export const STANDARD_PLAN_ORDER: StandardPlanKey[] = ["TIER_1", "TIER_2", "TIER_3"];

export const STANDARD_PLAN_KEYS = new Set<PlanKey>(STANDARD_PLAN_ORDER);

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}

export function getPlanByKey(key: string | null | undefined): PlanConfig {
  if (!key) return PLAN_CONFIG.TIER_1;
  return PLAN_CONFIG[key as PlanKey] ?? PLAN_CONFIG.TIER_1;
}
