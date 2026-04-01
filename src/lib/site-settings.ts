import { db } from "@/lib/db";
import { CONTACT_SETTING_KEY, DEFAULT_CONTACT } from "@/lib/constants";

export type ContactSettings = {
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  supportHours?: string;
  supportAddress?: string;
};

export async function getContactSettings(): Promise<ContactSettings> {
  const settings = await db.siteSetting.findUnique({ where: { key: CONTACT_SETTING_KEY } });
  if (!settings) return DEFAULT_CONTACT;

  return {
    ...DEFAULT_CONTACT,
    ...(settings.value as Partial<ContactSettings>)
  };
}

export async function upsertContactSettings(value: ContactSettings) {
  return db.siteSetting.upsert({
    where: { key: CONTACT_SETTING_KEY },
    create: { key: CONTACT_SETTING_KEY, value },
    update: { value }
  });
}
