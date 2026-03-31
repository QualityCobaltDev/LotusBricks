export const siteConfig = {
  name: "RightBricks",
  shortName: "RightBricks",
  title: "RightBricks | Trusted Property Marketplace in Cambodia",
  description:
    "RightBricks is a Cambodia-first property marketplace for buying, renting, and listing verified real estate with confidence.",
  domain: "https://www.rightbricks.online",
  locale: "en_US",
  themeColor: "#275DFF",
  contactEmail: "hello@rightbricks.online",
  contactPhoneDisplay: "+855 12 888 210",
  contactPhoneHref: "+85512888210",
  nav: [
    { href: "/buy", label: "Buy" },
    { href: "/rent", label: "Rent" },
    { href: "/sell", label: "Sell" },
    { href: "/landlords", label: "Landlords" },
    { href: "/developers", label: "Developers" },
    { href: "/pricing", label: "Pricing" }
  ] as const,
  social: {
    ogImage: "/og-image.png"
  }
} as const;
