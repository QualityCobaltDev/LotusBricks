import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/listings", "/discover", "/pricing", "/about", "/contact", "/support", "/resources", "/legal"],
        disallow: ["/admin", "/login", "/sign-in", "/account", "/api"]
      }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
