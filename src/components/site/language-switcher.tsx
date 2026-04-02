"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.replace(pathname, { locale: e.target.value as "en" | "km" });
  }

  return (
    <select
      value={locale}
      onChange={onChange}
      aria-label={t("label")}
      className="language-switcher"
    >
      <option value="en">{t("en")}</option>
      <option value="km">{t("km")}</option>
    </select>
  );
}
