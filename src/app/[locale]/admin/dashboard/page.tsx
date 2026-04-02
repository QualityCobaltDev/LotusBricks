import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const t = await getTranslations("admin");
  const [
    users,
    listings,
    inquiries,
    customInquiries,
    liveListings,
    newLeadsWeek,
    emailsSent,
    emailsFailed,
  ] = await Promise.all([
    db.user.count(),
    db.listing.count(),
    db.inquiry.count(),
    db.inquiry.count({ where: { inquiryType: "CUSTOM_PLAN" } }),
    db.listing.count({ where: { status: "PUBLISHED" } }),
    db.inquiry.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    db.emailLog.count({ where: { status: "SENT" } }),
    db.emailLog.count({ where: { status: "FAILED" } }),
  ]);

  return (
    <section className="shell section">
      <h1>{t("dashboardTitle")}</h1>
      <div className="stat-grid">
        <article className="stat-card">
          <p>{users}</p>
          <span>{t("users")}</span>
        </article>
        <article className="stat-card">
          <p>{listings}</p>
          <span>{t("totalListings")}</span>
        </article>
        <article className="stat-card">
          <p>{liveListings}</p>
          <span>{t("liveListings")}</span>
        </article>
        <article className="stat-card">
          <p>{inquiries}</p>
          <span>{t("totalLeads")}</span>
        </article>
        <article className="stat-card">
          <p>{newLeadsWeek}</p>
          <span>{t("newLeads7d")}</span>
        </article>
        <article className="stat-card">
          <p>{customInquiries}</p>
          <span>{t("customPlanLeads")}</span>
        </article>
        <article className="stat-card">
          <p>{emailsSent}</p>
          <span>{t("emailsSent")}</span>
        </article>
        <article className="stat-card">
          <p>{emailsFailed}</p>
          <span>{t("emailFailures")}</span>
        </article>
      </div>
      <p>
        <Link href="/admin/listings">{t("manageListings")}</Link> ·{" "}
        <Link href="/admin/inquiries">{t("leadManagement")}</Link> ·{" "}
        <Link href="/admin/users">{t("users")}</Link> ·{" "}
        <Link href="/admin/content">{t("content")}</Link> ·{" "}
        <Link href="/admin/pricing">{useTranslations("nav")("pricing")}</Link> ·{" "}
        <Link href="/admin/settings">{t("settings")}</Link>
      </p>
    </section>
  );
}
