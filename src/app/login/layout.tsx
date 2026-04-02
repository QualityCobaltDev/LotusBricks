import type { ReactNode } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
