import { db } from "@/lib/db";
import { BRAND_SETTING_KEY, CONTACT_SETTING_KEY } from "@/lib/constants";
import { logServerError } from "@/lib/observability";
import {
  BRAND_SETTINGS_FALLBACK,
  CONTACT_SETTINGS_FALLBACK,
  type BrandSettings,
  type ContactSettings
} from "@/lib/site-settings.defaults";

const loggedScopes = new Set<string>();

function logOnce(scope: string, error: unknown, details?: Record<string, unknown>) {
  if (loggedScopes.has(scope)) return;
  loggedScopes.add(scope);
  logServerError(scope, error, details);
}

function normalizeContact(value?: Partial<ContactSettings>): ContactSettings {
  const merged = { ...CONTACT_SETTINGS_FALLBACK, ...value };

  return {
    ...merged,
    email: CONTACT_SETTINGS_FALLBACK.email,
    emailHref: CONTACT_SETTINGS_FALLBACK.emailHref,
    phoneDisplay: CONTACT_SETTINGS_FALLBACK.phoneDisplay,
    phoneHref: CONTACT_SETTINGS_FALLBACK.phoneHref,
    whatsappHref: merged.whatsappHref ?? CONTACT_SETTINGS_FALLBACK.whatsappHref,
    telegramHref: merged.telegramHref ?? CONTACT_SETTINGS_FALLBACK.telegramHref
  };
}

function normalizeBrand(value?: Partial<BrandSettings>): BrandSettings {
  return {
    ...BRAND_SETTINGS_FALLBACK,
    ...value,
    faviconUrl: value?.faviconUrl || BRAND_SETTINGS_FALLBACK.faviconUrl,
    assetVersion: typeof value?.assetVersion === "number" ? value.assetVersion : BRAND_SETTINGS_FALLBACK.assetVersion
  };
}

export async function getContactSettingsServer(): Promise<ContactSettings> {
  if (!process.env.DATABASE_URL) {
    return CONTACT_SETTINGS_FALLBACK;
  }

  try {
    const settings = await db.siteSetting.findUnique({ where: { key: CONTACT_SETTING_KEY } });
    return normalizeContact(settings?.value as Partial<ContactSettings> | undefined);
  } catch (error) {
    logOnce("site-settings:contact", error, { key: CONTACT_SETTING_KEY });
    return CONTACT_SETTINGS_FALLBACK;
  }
}

export async function getBrandSettingsServer(): Promise<BrandSettings> {
  if (!process.env.DATABASE_URL) {
    return BRAND_SETTINGS_FALLBACK;
  }

  try {
    const settings = await db.siteSetting.findUnique({ where: { key: BRAND_SETTING_KEY } });
    return normalizeBrand(settings?.value as Partial<BrandSettings> | undefined);
  } catch (error) {
    logOnce("site-settings:brand", error, { key: BRAND_SETTING_KEY });
    return BRAND_SETTINGS_FALLBACK;
  }
}
