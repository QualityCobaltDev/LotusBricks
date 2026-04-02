import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });
  return { title: t("buyerTitle"), description: t("buyerSubtitle"), alternates: { canonical: "/resources/buyer-due-diligence-checklist" } };
}

export default async function BuyerDueDiligenceChecklistPage() {
  const t = await getTranslations("resources");
  return (
    <section className="shell section narrow">
      <h1>{t("buyerTitle")}</h1>
      <p className="muted">{t("buyerSubtitle")}</p>
    </section>
  );
}
