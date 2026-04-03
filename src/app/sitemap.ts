import type { MetadataRoute } from "next";
import { db, isDatabaseConfigured } from "@/lib/db";
import { getCanonicalSiteUrl } from "@/lib/env";
import { RESOURCE_ARTICLES } from "@/lib/resources";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getCanonicalSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/listings`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...RESOURCE_ARTICLES.map((article) => ({
      url: `${base}/resources/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];

  if (!isDatabaseConfigured()) return staticRoutes;

  try {
    const listings = await db.listing.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true }
    });

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
