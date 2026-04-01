import type { Metadata } from "next";
import "../styles/globals.css";
import { getSession, roleToRedirect } from "@/lib/auth";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getContactSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: {
    default: "RightBricks | Verified Property Marketplace",
    template: "%s | RightBricks"
  },
  description:
    "Discover verified properties with transparent pricing, premium media, and investor-ready insights across major urban markets."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const contact = await getContactSettings();
  const dashboardHref = session ? roleToRedirect(session.role) : "/sign-in";

  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SiteHeader dashboardHref={dashboardHref} contactPhoneDisplay={contact.phoneDisplay} contactPhoneHref={contact.phoneHref} />
        <main id="main-content">{children}</main>
        <SiteFooter email={contact.email} emailHref={contact.emailHref} phoneDisplay={contact.phoneDisplay} phoneHref={contact.phoneHref} />
      </body>
    </html>
  );
}
