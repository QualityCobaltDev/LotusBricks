import { cache } from "react";
import { db } from "@/lib/db";
import { CONTACT_SETTING_KEY } from "@/lib/constants";
import { logServerError } from "@/lib/observability";
import { CONTACT_SETTINGS_FALLBACK, type ContactSettings } from "@/lib/site-settings.defaults";

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

export const getContactSettingsServer = cache(async (): Promise<ContactSettings> => {
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
});
