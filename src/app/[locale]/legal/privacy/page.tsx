import { getContactSettings } from "@/lib/site-settings";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const contact = await getContactSettings();

  const sections = [
    { title: t("informationCollect"), body: t("informationCollectBody") },
    { title: t("howWeUse"), body: t("howWeUseBody") },
    { title: t("cookies"), body: t("cookiesBody") },
    { title: t("sharing"), body: t("sharingBody") },
    { title: t("retention"), body: t("retentionBody") },
    { title: t("yourRights"), body: t("yourRightsBody") }
  ];

  return (
    <section className="shell section narrow">
      <h1>{t("title")}</h1>
      <p className="muted">{t("lastUpdated")}</p>
      {sections.map((section) => (
        <article key={section.title} className="card-pad" style={{ marginBottom: "0.8rem" }}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </article>
      ))}
      <article className="card-pad">
        <h2>{t("contactTitle")}</h2>
        <p>{t("privacyRequests")} <a href={contact.emailHref}>{contact.email}</a> · <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
      </article>
    </section>
  );
}
