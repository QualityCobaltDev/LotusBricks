import type { Metadata } from "next";
import "../../styles/globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getContactSettings } from "@/lib/site-settings";
import { getSafeSiteUrl } from "@/lib/env";
import { ConsentBanner } from "@/components/site/consent-banner";
import { AnalyticsProvider } from "@/components/site/analytics-provider";
import { EventTracker } from "@/components/site/event-tracker";
import { buildWebSiteJsonLd } from "@/lib/metadata";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const siteUrl = getSafeSiteUrl();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${t("siteName")} | ${t("tagline")}`,
      template: `%s | ${t("siteName")}`
    },
    description: t("tagline"),
    openGraph: {
      title: `${t("siteName")} | ${t("tagline")}`,
      description: t("tagline"),
      url: siteUrl,
      siteName: t("siteName"),
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("tagline")
    },
    alternates: { canonical: "/" }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const contact = await getContactSettings();
  const dashboardHref = "/login/customer";
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RightBricks",
    url: siteUrl,
    email: contact.email,
    telephone: "+85511389625",
    sameAs: ["https://wa.me/85511389625", "https://t.me/"]
  };

  const webSiteLd = buildWebSiteJsonLd();

  return (
    <html lang={locale}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={locale === "km" ? "font-khmer" : ""}>
        <NextIntlClientProvider messages={messages}>
          <a href="#main-content" className="skip-link">{messages && (messages as any).common?.skipToContent || "Skip to main content"}</a>
          <SiteHeader dashboardHref={dashboardHref} />
          <main id="main-content">{children}</main>
          <ConsentBanner />
          <AnalyticsProvider />
          <EventTracker />
          <SiteFooter
            email={contact.email}
            emailHref={contact.emailHref}
            phoneDisplay={contact.phoneDisplay}
            phoneHref={contact.phoneHref}
            whatsappHref={contact.whatsappHref}
            telegramHref={contact.telegramHref}
            appVersion={appVersion}
          />
        </NextIntlClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
      </body>
    </html>
  );
}
