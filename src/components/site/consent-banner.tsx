"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readConsent, writeConsent } from "@/lib/analytics/events";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === "unset");
  }, []);

  if (!visible) return null;

  return (
    <aside className="consent-banner" aria-live="polite" aria-label="Cookie consent">
      <p>
        We use analytics cookies to improve listings discovery and support quality. You can change this anytime in your browser storage settings. Read our <Link href="/legal/privacy">Privacy Policy</Link>.
      </p>
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={() => {
          writeConsent("accepted");
          setVisible(false);
        }}>Accept analytics</button>
        <button className="btn btn-ghost" onClick={() => {
          writeConsent("rejected");
          setVisible(false);
        }}>Decline</button>
      </div>
    </aside>
  );
}
