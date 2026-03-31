import type { MetadataRoute } from "next";
import { getAllListings } from "@/lib/marketplace-data";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/buy", "/rent", "/sell", "/landlords", "/developers", "/pricing", "/request-valuation"];

  const listingRoutes = getAllListings().map((listing) => ({
    url: `${siteConfig.domain}/listings/${listing.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.domain}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1 : 0.7
    })),
    ...listingRoutes
  ];
}
