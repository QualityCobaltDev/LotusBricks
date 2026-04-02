import type { Metadata } from "next";
import { trustStats } from "@/lib/site/content";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("subtitle"), alternates: { canonical: "/about" } };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tStats = await getTranslations("stats");
  const statLabels = [tStats("verifiedListings"), tStats("monthlyInquiries"), tStats("metroRegions"), tStats("avgResponseTime")];

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>{t("title")}</h1>
        <p className="muted">{t("subtitle")}</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>{t("whatWeVerify")}</h2>
          <ul className="check-list">
            <li>{t("verify1")}</li>
            <li>{t("verify2")}</li>
            <li>{t("verify3")}</li>
          </ul>
          <h3>{t("whoWeServe")}</h3>
          <p>{t("whoWeServeBody")}</p>
        </article>
        <article className="card-pad">
          <h2>{t("operatingPrinciples")}</h2>
          <ol>
            <li>{t("principle1")}</li>
            <li>{t("principle2")}</li>
            <li>{t("principle3")}</li>
          </ol>
          <p className="muted">{t("expansionNote")}</p>
        </article>
      </div>

      <div className="stat-grid">
        {trustStats.map((item, i) => (
          <article key={item.label} className="stat-card"><p>{item.value}</p><span>{statLabels[i]}</span></article>
        ))}
      </div>

      <section className="cta-band">
        <h2>{t("ctaTitle")}</h2>
        <div className="hero-actions">
          <Link href="/contact" className="btn btn-primary">{t("speakWithTeam")}</Link>
          <Link href="/listings" className="btn btn-ghost">{t("viewLiveInventory")}</Link>
        </div>
      </section>
    </section>
  );
}
