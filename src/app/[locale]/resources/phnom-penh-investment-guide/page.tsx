import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });
  return { title: t("phnomPenhTitle"), description: t("phnomPenhSubtitle"), alternates: { canonical: "/resources/phnom-penh-investment-guide" } };
}

export default async function PhnomPenhInvestmentGuidePage() {
  const t = await getTranslations("resources");
  return (
    <section className="shell section narrow">
      <h1>{t("phnomPenhTitle")}</h1>
      <p className="muted">{t("phnomPenhSubtitle")}</p>
    </section>
  );
}
