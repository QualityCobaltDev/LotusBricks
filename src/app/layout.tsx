import type { Metadata } from "next";
import "../styles/globals.css";
import { getSession, roleToRedirect } from "@/lib/auth";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getContactSettings } from "@/lib/site-settings";
import { getSafeSiteUrl } from "@/lib/env";
import { logServerError } from "@/lib/observability";

const siteUrl = getSafeSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RightBricks | Verified Property Marketplace",
    template: "%s | RightBricks"
  },
  description:
    "Discover verified properties with transparent pricing, premium media, and investor-ready insights across Cambodia.",
  openGraph: {
    title: "RightBricks | Verified Property Marketplace",
    description: "Verified property intelligence for buyers, renters, agencies, and investors.",
    url: siteUrl,
    siteName: "RightBricks",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "RightBricks",
    description: "Verified property marketplace and intelligence platform."
  },
  alternates: { canonical: "/" }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session: Awaited<ReturnType<typeof getSession>> = null;

  try {
    session = await getSession();
  } catch (error) {
    logServerError("layout-session", error);
  }

  const contact = await getContactSettings();
  const dashboardHref = session ? roleToRedirect(session.role) : "/login/customer";
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RightBricks",
    url: siteUrl,
    email: contact.email,
    telephone: "+85511389625",
    sameAs: ["https://wa.me/85511389625", "https://t.me/"]
  };


  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SiteHeader dashboardHref={dashboardHref} />
        <main id="main-content">{children}</main>
        <SiteFooter email={contact.email} emailHref={contact.emailHref} phoneDisplay={contact.phoneDisplay} phoneHref={contact.phoneHref} whatsappHref={contact.whatsappHref} telegramHref={contact.telegramHref} appVersion={appVersion} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </body>
    </html>
  );
}
