import { DEFAULT_CONTACT } from "@/lib/constants";

export type ContactSettings = {
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  supportHours?: string;
  supportAddress?: string;
  whatsappHref?: string;
  telegramHref?: string;
};

export const CONTACT_SETTINGS_FALLBACK: ContactSettings = {
  ...DEFAULT_CONTACT,
  supportHours: "Mon-Sat 8:30-18:30 (ICT)",
  supportAddress: "Phnom Penh, Cambodia"
};
