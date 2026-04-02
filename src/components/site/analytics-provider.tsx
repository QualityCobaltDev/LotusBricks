"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/events";

export function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") trackEvent("view_home");
    if (pathname === "/listings") trackEvent("view_listings", { path: pathname });
    if (pathname.startsWith("/login")) trackEvent("login_view", { path: pathname });
  }, [pathname]);

  return null;
}
