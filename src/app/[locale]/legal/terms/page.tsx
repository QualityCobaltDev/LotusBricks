import { getContactSettings } from "@/lib/site-settings";
import { getTranslations } from "next-intl/server";

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const contact = await getContactSettings();

  const sections = [
    { title: t("marketplaceUse"), body: t("marketplaceUseBody") },
    { title: t("listingStandards"), body: t("listingStandardsBody") },
    { title: t("prohibitedConduct"), body: t("prohibitedConductBody") },
    { title: t("intellectualProperty"), body: t("intellectualPropertyBody") },
    { title: t("disclaimers"), body: t("disclaimersBody") }
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
        <p>{t("termsQuestions")} <a href={contact.emailHref}>{contact.email}</a> · <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
      </article>
    </section>
  );
}
