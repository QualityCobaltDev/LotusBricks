"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics/events";

export function EventTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>("[data-track-event]");
      if (!element) return;
      const eventName = element.dataset.trackEvent as AnalyticsEventName | undefined;
      if (!eventName) return;
      trackEvent(eventName, {
        label: element.dataset.trackLabel,
        href: (element as HTMLAnchorElement).href ?? undefined
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
