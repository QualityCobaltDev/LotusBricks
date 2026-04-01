import { db } from "@/lib/db";
import { PLAN_CONFIG, PLAN_ORDER, type PlanConfig, type PlanKey } from "@/lib/plans";

const PRICING_SETTING_KEY = "pricing.tiers.v1";

type PricingOverrides = Record<PlanKey, Partial<PlanConfig>>;

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

export async function getPricingPlans(): Promise<PlanConfig[]> {
  const setting = await db.siteSetting.findUnique({ where: { key: PRICING_SETTING_KEY } });
  const overrides = (setting?.value ?? {}) as PricingOverrides;
  return PLAN_ORDER.map((key) => sanitizeOverride(PLAN_CONFIG[key], overrides[key])).filter((plan) => plan.isActive !== false);
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
