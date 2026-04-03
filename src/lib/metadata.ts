import type { Metadata } from "next";
import { getCanonicalSiteUrl } from "@/lib/env";

const BRAND = "RightBricks";
const siteUrl = getCanonicalSiteUrl();

function normalizeTitle(raw: string) {
  return raw
    .replace(new RegExp(`\\|\\s*${BRAND}`, "gi"), "")
    .replace(new RegExp(`${BRAND}\\s*\\|`, "gi"), "")
    .replace(new RegExp(BRAND, "gi"), BRAND)
    .trim();
}

export function buildPageTitle(raw: string) {
  const cleaned = normalizeTitle(raw);
  if (!cleaned) return BRAND;
  return cleaned;
}

export function buildMetadata({
  title,
  description,
  path,
  image = "/og-default.png",
  type = "website"
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const cleanTitle = buildPageTitle(title);
  const url = `${siteUrl}${path}`;

  return {
    title: cleanTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: cleanTitle,
      description,
      url,
      siteName: BRAND,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: cleanTitle }]
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description,
      images: [image]
    }
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`
    }))
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/listings?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildOrganizationJsonLd(input: {
  email: string;
  telephone: string;
  sameAs: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND,
    url: siteUrl,
    email: input.email,
    telephone: input.telephone,
    sameAs: input.sameAs
  };
}
