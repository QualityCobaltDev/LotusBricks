"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { readConsent, writeConsent } from "@/lib/analytics/events";

export function ConsentBanner() {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === "unset");
  }, []);

  if (!visible) return null;

  return (
    <aside className="consent-banner" aria-live="polite" aria-label="Cookie consent">
      <p>
        {t("message")} <Link href="/legal/privacy">{t("privacyPolicy")}</Link>.
      </p>
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={() => {
          writeConsent("accepted");
          setVisible(false);
        }}>{t("accept")}</button>
        <button className="btn btn-ghost" onClick={() => {
          writeConsent("rejected");
          setVisible(false);
        }}>{t("decline")}</button>
      </div>
    </aside>
  );
}
