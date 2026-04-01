import type { Metadata } from "next";
import "../styles/globals.css";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

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
  const dashboardHref = session ? (session.role === "ADMIN" ? "/admin" : "/account") : "/sign-in";

  return (
    <html lang="en">
      <body>
        <SiteHeader dashboardHref={dashboardHref} />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
