import type { Metadata } from "next";
import "@/styles/globals.css";
import { PublicNav } from "@/components/nav/public-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: siteConfig.title,
    template: "%s | RightBricks"
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Cambodia property",
    "Phnom Penh real estate",
    "Cambodia rentals",
    "Cambodia property marketplace",
    "RightBricks"
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.domain,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.social.ogImage }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.social.ogImage]
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PublicNav />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
