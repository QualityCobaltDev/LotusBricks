import { db } from "@/lib/db";
import { logServerError } from "@/lib/observability";
import { PLAN_CONFIG, PLAN_ORDER, type PlanConfig, type PlanKey } from "@/lib/plans";

const PRICING_SETTING_KEY = "pricing.tiers.v1";

type PricingOverrides = Record<PlanKey, Partial<PlanConfig>>;
const loggedScopes = new Set<string>();

function sanitizeOverride(plan: PlanConfig, override?: Partial<PlanConfig>): PlanConfig {
  const merged = { ...plan, ...override };
  return {
    ...merged,
    key: plan.key,
    recurringMonthlyUsd: plan.contactOnly ? null : merged.recurringMonthlyUsd,
    oneTimeSignupFeeUsd: plan.contactOnly ? 0 : Number(merged.oneTimeSignupFeeUsd ?? plan.oneTimeSignupFeeUsd),
    isActive: merged.isActive ?? true
  };
}

function resolvePlans(overrides?: PricingOverrides) {
  return PLAN_ORDER.map((key) => sanitizeOverride(PLAN_CONFIG[key], overrides?.[key])).filter((plan) => plan.isActive !== false);
}

async function getPricingPlansServer(): Promise<PlanConfig[]> {
  if (!process.env.DATABASE_URL) {
    return resolvePlans();
  }

  try {
    const setting = await db.siteSetting.findUnique({ where: { key: PRICING_SETTING_KEY } });
    return resolvePlans((setting?.value ?? {}) as PricingOverrides);
  } catch (error) {
    if (!loggedScopes.has("pricing-settings")) {
      loggedScopes.add("pricing-settings");
      logServerError("pricing-settings", error, { key: PRICING_SETTING_KEY });
    }
    return resolvePlans();
  }
}

export async function getPricingPlans(): Promise<PlanConfig[]> {
  return getPricingPlansServer();
}

export async function getPricingPlanByKey(key: PlanKey): Promise<PlanConfig> {
  const plans = await getPricingPlans();
  return plans.find((plan) => plan.key === key) ?? PLAN_CONFIG[key];
}

export async function upsertPricingSettings(value: PricingOverrides) {
  return db.siteSetting.upsert({
    where: { key: PRICING_SETTING_KEY },
    create: { key: PRICING_SETTING_KEY, value },
    update: { value }
  });
}

export { PRICING_SETTING_KEY };
