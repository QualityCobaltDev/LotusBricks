import type { Metadata } from "next";
import "@/styles/globals.css";
import { PublicNav } from "@/components/nav/public-nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rightbricks.online"),
  title: {
    default: "RightBricks | Trusted Property Marketplace in Cambodia",
    template: "%s | RightBricks"
  },
  description:
    "RightBricks is a premium Cambodia-first real estate marketplace and seller platform for buying, renting, and listing with confidence."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PublicNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
