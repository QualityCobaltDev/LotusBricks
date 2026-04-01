import { db } from "@/lib/db";
import { CONTACT_SETTING_KEY } from "@/lib/constants";
import { getContactSettingsServer } from "@/lib/site-settings.server";
import type { ContactSettings } from "@/lib/site-settings.defaults";

export type { ContactSettings } from "@/lib/site-settings.defaults";

export async function getContactSettings(): Promise<ContactSettings> {
  return getContactSettingsServer();
}

export async function upsertContactSettings(value: ContactSettings) {
  return db.siteSetting.upsert({
    where: { key: CONTACT_SETTING_KEY },
    create: { key: CONTACT_SETTING_KEY, value },
    update: { value }
  });
}
