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

export type BrandSettings = {
  siteName: string;
  tagline: string;
  supportEmail: string;
  displayPhone: string;
  phoneLink: string;
  whatsappLink: string;
  telegramLink: string;
  supportHours: string;
  address: string;
  maintenanceBanner: string;
  headerLogoUrl: string;
  faviconUrl: string;
  assetVersion: number;
};

export const CONTACT_SETTINGS_FALLBACK: ContactSettings = {
  ...DEFAULT_CONTACT,
  supportHours: "Mon-Sat 8:30-18:30 (ICT)",
  supportAddress: "Phnom Penh, Cambodia"
};

export const BRAND_SETTINGS_FALLBACK: BrandSettings = {
  siteName: "RightBricks",
  tagline: "Verified property marketplace in Cambodia",
  supportEmail: "contact@rightbricks.online",
  displayPhone: "(+855) 011 389 625",
  phoneLink: "tel:+85511389625",
  whatsappLink: "https://wa.me/85511389625",
  telegramLink: "https://t.me/",
  supportHours: "Mon-Sat 8:00-20:00 ICT",
  address: "Phnom Penh, Cambodia",
  maintenanceBanner: "",
  headerLogoUrl: "",
  faviconUrl: "/favicon.ico",
  assetVersion: 1
};
