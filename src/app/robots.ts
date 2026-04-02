import type { MetadataRoute } from "next";
import { getSafeSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = getSafeSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`
  };
}
