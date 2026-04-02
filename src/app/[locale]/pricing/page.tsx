import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { faqs } from "@/lib/site/content";
import { formatUsd } from "@/lib/plans";
import { getPricingPlans } from "@/lib/pricing-settings";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return buildMetadata({ title: t("title"), description: t("subtitle"), path: "/pricing" });
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const plans = await getPricingPlans();

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>{t("title")}</h1>
        <p className="muted">{t("subtitle")}</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article key={plan.key} className={`pricing-card ${plan.featured ? "featured" : ""} ${plan.key === "CUSTOM" ? "premium" : ""}`}>
            <div>
              {plan.badge && <p className="eyebrow">{plan.badge}</p>}
              <h3>{plan.name}</h3>
              {plan.blurb && <p className="muted">{plan.blurb}</p>}
            </div>
            {plan.contactOnly ? (
              <>
                <p className="price">{t("customPlan")}</p>
                <p className="muted">{t("contactUsForPricing")}</p>
              </>
            ) : (
              <>
                <p className="price">{formatUsd(plan.recurringMonthlyUsd ?? 0)} <small>{t("perMonth")}</small></p>
                <p className="muted">{t("signupFee", { monthly: formatUsd(plan.recurringMonthlyUsd ?? 0), signup: formatUsd(plan.oneTimeSignupFeeUsd) })}</p>
                <p><strong>{t("totalUpfront", { total: formatUsd((plan.recurringMonthlyUsd ?? 0) + plan.oneTimeSignupFeeUsd) })}</strong></p>
              </>
            )}
            <ul>
              <li>{plan.listingLimit === null ? t("listingsPlus") : t("listings", { count: plan.listingLimit })}</li>
              <li>{t("photosPerListing", { count: plan.photosPerListing })}</li>
              <li>{t("videosPerListing", { count: plan.videosPerListing })}</li>
            </ul>
            <a href={plan.ctaHref} className={`btn ${plan.contactOnly ? "btn-ghost" : "btn-primary"}`} data-track-event="choose_tier" data-track-label={plan.key}>{plan.contactOnly ? t("contactUs") : plan.ctaLabel}</a>
          </article>
        ))}
      </div>

      <div className="section two-col">
        <article className="card-pad">
          <h2>{t("faq")}</h2>
          {faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </article>
        <article className="card-pad">
          <h2>{t("customTierPath")}</h2>
          <p>{t("customTierBody")}</p>
          <a className="btn btn-primary" href="/contact?plan=custom&tierNeeds=10-plus">{t("contactUs")}</a>
        </article>
      </div>
    </section>
  );
}
