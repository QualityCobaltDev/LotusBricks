const DEFAULT_CANONICAL_HOST = "rightbricks.online";

export function getCanonicalHost() {
  return (process.env.NEXT_PUBLIC_CANONICAL_HOST ?? DEFAULT_CANONICAL_HOST).trim().toLowerCase();
}

export function getCanonicalRedirectUrl(input: { host: string | null; pathname: string; search: string; protocol: string }): string | null {
  const host = (input.host ?? "").toLowerCase();
  const canonicalHost = getCanonicalHost();
  if (!host || host === canonicalHost) return null;

  const normalizedHost = host.split(":")[0];
  if (normalizedHost === `www.${canonicalHost}`) {
    return `${input.protocol}//${canonicalHost}${input.pathname}${input.search}`;
  }

  return null;
}

export function normalizePublicHref(href: string): string {
  if (!href) return href;
  if (href.startsWith("/") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  try {
    const parsed = new URL(href);
    const canonicalHost = getCanonicalHost();
    const host = parsed.hostname.toLowerCase();
    if (host === canonicalHost || host === `www.${canonicalHost}`) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return href;
  } catch {
    return href;
  }
}

const allowedContactPlans = new Set(["TIER_1", "TIER_2", "TIER_3", "CUSTOM"]);

export function normalizeContactPlan(value: string) {
  const plan = value.trim().toUpperCase().replaceAll("-", "_");
  if (plan === "TIER1") return "TIER_1";
  if (plan === "TIER2") return "TIER_2";
  if (plan === "TIER3") return "TIER_3";
  return allowedContactPlans.has(plan) ? plan : "";
}

export function getPublicAppVersion(value: string | undefined) {
  if (!value) return "";
  const normalized = value.trim();
  if (!normalized) return "";
  if (["dev", "development", "local", "snapshot"].includes(normalized.toLowerCase())) return "";
  return normalized;
}
