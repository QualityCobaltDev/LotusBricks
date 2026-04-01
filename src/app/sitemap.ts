import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rightbricks.online";
  const pages = ["", "/listings", "/pricing", "/about", "/contact", "/login/customer", "/login/admin", "/support", "/support/forgot-password", "/legal/privacy", "/legal/terms", "/legal/accessibility", "/resources", "/resources/phnom-penh-investment-guide", "/resources/buyer-due-diligence-checklist", "/resources/developer-listing-playbook"];
  return pages.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));
}
