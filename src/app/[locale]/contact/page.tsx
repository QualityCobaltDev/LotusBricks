import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { db, isDatabaseConfigured } from "@/lib/db";
import { ContactForm } from "@/components/ui/contact-form";
import { logServerError } from "@/lib/observability";
import { getContactSettings } from "@/lib/site-settings";
import { CONTACT } from "@/lib/contact";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({ title: t("title"), description: t("title"), path: "/contact" });
}

function normalizePlan(value: string) {
  const plan = value.trim().toUpperCase().replaceAll("-", "_");
  if (plan === "TIER1") return "TIER_1";
  if (plan === "TIER2") return "TIER_2";
  if (plan === "TIER3") return "TIER_3";
  return plan;
}

type ContactPageProps = {
  searchParams: Promise<{ plan?: string; tierNeeds?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const t = await getTranslations("contact");
  const contact = await getContactSettings();
  let fallbackListing: { id: string } | null = null;

  if (isDatabaseConfigured()) {
    try {
      fallbackListing = await db.listing.findFirst({ where: { status: "PUBLISHED" }, select: { id: true } });
    } catch (error) {
      logServerError("contact-page", error);
    }
  }

  const isCustomPlan = params.plan === "custom" || params.tierNeeds === "10-plus";

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>{t("title")}</h1>
        <p className="muted">{CONTACT.availabilityLine} {CONTACT.responseTime}</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>{isCustomPlan ? t("speakToSales") : t("talkToSpecialist")}</h2>
          <p>Email: <a href={contact.emailHref}>{contact.email}</a></p>
          <p>Phone: <a href={contact.phoneHref}>{contact.phoneDisplay}</a></p>
          <p>
            <a className="btn btn-ghost" href={CONTACT.whatsappHref}>WhatsApp</a>{" "}
            <a className="btn btn-ghost" href={CONTACT.telegramHref}>Telegram</a>
          </p>
          <p className="muted">{t("availableWhatsappTelegram")}</p>
          {contact.supportHours && <p>{t("supportHours", { hours: contact.supportHours })}</p>}
          {contact.supportAddress && <p>{t("office", { address: contact.supportAddress })}</p>}
        </article>
        <article className="card-pad">
          <h2>{isCustomPlan ? t("requestCustomTier") : t("sendUsMessage")}</h2>
          <p className="muted">{t("whatHappensNext")}</p>
          <ContactForm
            listingId={fallbackListing?.id ?? ""}
            selectedPlan={normalizePlan(params.plan ?? "")}
            inquiryType={isCustomPlan ? "CUSTOM_PLAN" : "CONTACT"}
          />
        </article>
      </div>
    </section>
  );
}
