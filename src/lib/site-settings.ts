import { db } from "@/lib/db";
import { BRAND_SETTING_KEY, CONTACT_SETTING_KEY } from "@/lib/constants";
import { getBrandSettingsServer, getContactSettingsServer } from "@/lib/site-settings.server";
import type { BrandSettings, ContactSettings } from "@/lib/site-settings.defaults";

export type { BrandSettings, ContactSettings } from "@/lib/site-settings.defaults";

export async function getContactSettings(): Promise<ContactSettings> {
  return getContactSettingsServer();
}

export async function getBrandSettings(): Promise<BrandSettings> {
  return getBrandSettingsServer();
}

export async function upsertContactSettings(value: ContactSettings) {
  return db.siteSetting.upsert({
    where: { key: CONTACT_SETTING_KEY },
    create: { key: CONTACT_SETTING_KEY, value },
    update: { value }
  });
}

export async function upsertBrandSettings(value: BrandSettings) {
  return db.siteSetting.upsert({
    where: { key: BRAND_SETTING_KEY },
    create: { key: BRAND_SETTING_KEY, value },
    update: { value }
  });
}
