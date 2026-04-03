import type { MetadataRoute } from "next";
import { db, isDatabaseConfigured } from "@/lib/db";
import { getSafeSiteUrl } from "@/lib/env";
import { RESOURCE_ARTICLES } from "@/lib/resources";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSafeSiteUrl();
  const now = new Date();
  const resourceRoutes = RESOURCE_ARTICLES.map((article) => `/resources/${article.slug}`);
  const pages = ["", "/listings", "/pricing", "/about", "/contact", "/login/admin", "/support", "/support/forgot-password", "/legal/privacy", "/legal/terms", "/legal/accessibility", "/resources", ...resourceRoutes];

  const staticRoutes: MetadataRoute.Sitemap = pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7
  }));

  if (!isDatabaseConfigured()) return staticRoutes;

  try {
    const listings = await db.listing.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } });
    const dynamicRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
      url: `${base}/listings/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: "daily",
      priority: 0.8
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
