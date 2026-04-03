import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/listings", "/pricing", "/about", "/contact", "/resources"],
        disallow: ["/admin", "/login", "/account", "/api"]
      }
    ],
    sitemap: `${base}/sitemap.xml`
  };
}
