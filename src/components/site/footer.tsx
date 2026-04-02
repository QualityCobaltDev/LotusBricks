"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function SiteFooter({
  emailHref,
  email,
  phoneHref,
  phoneDisplay,
  whatsappHref,
  telegramHref,
  appVersion
}: {
  emailHref: string;
  email: string;
  phoneHref: string;
  phoneDisplay: string;
  whatsappHref?: string;
  telegramHref?: string;
  appVersion?: string;
}) {
  const t = useTranslations("footer");
  const tc = useTranslations("common");

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <h3>{tc("siteName")}</h3>
          <p>{t("description")}</p>
          <p className="muted">✉️ <a href={emailHref}>{email}</a> · ☎️ <a href={phoneHref}>{phoneDisplay}</a></p>
          <p className="muted">💬 <a href={whatsappHref}>WhatsApp</a> · 📲 <a href={telegramHref}>Telegram</a></p>
        </div>
        <div>
          <h4>{t("explore")}</h4>
          <ul>
            <li><Link href="/listings">{useTranslations("nav")("listings")}</Link></li>
            <li><Link href="/pricing">{useTranslations("nav")("pricing")}</Link></li>
            <li><Link href="/about">{useTranslations("nav")("about")}</Link></li>
            <li><Link href="/contact">{useTranslations("nav")("contact")}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t("trustAndLegal")}</h4>
          <ul>
            <li><Link href="/support">{t("supportCenter")}</Link></li>
            <li><Link href="/legal/privacy">{t("privacyPolicy")}</Link></li>
            <li><Link href="/legal/terms">{t("terms")}</Link></li>
            <li><Link href="/legal/accessibility">{t("accessibility")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>{tc("allRightsReserved", { year: new Date().getFullYear() })}</span>
        <span>{appVersion ? `${tc("version", { version: appVersion })} · ` : ""}{tc("builtFor")}</span>
      </div>
    </footer>
  );
}
