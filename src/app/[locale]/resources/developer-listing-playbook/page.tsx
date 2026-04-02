import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });
  return { title: t("developerTitle"), description: t("developerSubtitle"), alternates: { canonical: "/resources/developer-listing-playbook" } };
}

export default async function DeveloperListingPlaybookPage() {
  const t = await getTranslations("resources");
  return (
    <section className="shell section narrow">
      <h1>{t("developerTitle")}</h1>
      <p className="muted">{t("developerSubtitle")}</p>
    </section>
  );
}
