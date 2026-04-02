import { getContactSettings } from "@/lib/site-settings";
import { getTranslations } from "next-intl/server";

export default async function AccessibilityPage() {
  const t = await getTranslations("accessibility");
  const contact = await getContactSettings();
  return (
    <section className="shell section">
      <h1>{t("title")}</h1>
      <p>{t("body")}</p>
      <p>{t("contactMessage")} <a href={contact.emailHref}>{contact.email}</a> · <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
    </section>
  );
}
