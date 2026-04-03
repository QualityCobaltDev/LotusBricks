import type { Metadata } from "next";
import "../styles/globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getContactSettings } from "@/lib/site-settings";
import { getCanonicalSiteUrl } from "@/lib/env";
import { ConsentBanner } from "@/components/site/consent-banner";
import { AnalyticsProvider } from "@/components/site/analytics-provider";
import { EventTracker } from "@/components/site/event-tracker";
import { FloatingContactCta } from "@/components/site/floating-contact";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/metadata";
import { getPublicAppVersion } from "@/lib/routing";

const siteUrl = getCanonicalSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Verified Property Marketplace in Cambodia",
    template: "%s | RightBricks"
  },
  description:
    "Discover verified properties with transparent pricing, premium media, and investor-ready insights across Cambodia.",
  openGraph: {
    title: "Verified Property Marketplace in Cambodia",
    description: "Verified property intelligence for buyers, renters, agencies, and investors.",
    url: siteUrl,
    siteName: "RightBricks",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified Property Marketplace",
    description: "Verified property marketplace and intelligence platform."
  },
  alternates: { canonical: "/" }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = await getContactSettings();
  const appVersion = getPublicAppVersion(process.env.NEXT_PUBLIC_APP_VERSION);
  const orgLd = buildOrganizationJsonLd({
    email: contact.email,
    telephone: "+85511389625",
    sameAs: ["https://wa.me/85511389625", "https://t.me/"]
  });

  const webSiteLd = buildWebSiteJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var key="rightbricks-theme";var stored=localStorage.getItem(key);var theme=stored||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=theme;}catch(e){}})();'
          }}
        />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <ConsentBanner />
        <AnalyticsProvider />
        <EventTracker />
        <FloatingContactCta />
        <SiteFooter
          email={contact.email}
          emailHref={contact.emailHref}
          phoneDisplay={contact.phoneDisplay}
          phoneHref={contact.phoneHref}
          whatsappHref={contact.whatsappHref}
          telegramHref={contact.telegramHref}
          supportHours={contact.supportHours}
          supportAddress={contact.supportAddress}
          appVersion={appVersion}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
      </body>
    </html>
  );
}
