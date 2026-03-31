import { OFFICIAL_CONTACT } from "@/lib/contact";

export const siteConfig = {
  name: "RightBricks",
  shortName: "RightBricks",
  title: "RightBricks | Trusted Property Marketplace in Cambodia",
  description:
    "RightBricks is a Cambodia-first property marketplace for buying, renting, and listing verified real estate with confidence.",
  domain: "https://www.rightbricks.online",
  locale: "en_US",
  themeColor: "#275DFF",
  contactEmail: OFFICIAL_CONTACT.email,
  contactPhoneDisplay: OFFICIAL_CONTACT.phoneDisplay,
  contactPhoneHref: OFFICIAL_CONTACT.phoneHref,
  nav: [
    { href: "/buy", label: "Buy" },
    { href: "/rent", label: "Rent" },
    { href: "/sell", label: "Sell" },
    { href: "/landlords", label: "Landlords" },
    { href: "/developers", label: "Developers" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" }
  ] as const,
  social: {
    ogImage: "/og-image.png"
  }
} as const;
