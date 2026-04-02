import { getContactSettings } from "@/lib/site-settings";
import { getTranslations } from "next-intl/server";

export default async function SupportPage() {
  const t = await getTranslations("support");
  const contact = await getContactSettings();
  return (
    <section className="shell section">
      <div className="section-head">
        <h1>{t("title")}</h1>
        <p className="muted">{t("subtitle")}</p>
      </div>
      <article className="card-pad">
        <p>Email: <a href={contact.emailHref}>{contact.email}</a></p>
        <p>Phone: <a href={contact.phoneHref}>{contact.phoneDisplay}</a></p>
        <p>{t("contactSoon")}</p>
      </article>
    </section>
  );
}
