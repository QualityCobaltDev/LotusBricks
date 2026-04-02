import { redirect } from "next/navigation";
import { getSession, roleToRedirect } from "@/lib/auth";
import { SignInForm } from "@/components/site/sign-in-form";
import { getTranslations } from "next-intl/server";

export default async function CustomerLoginPage() {
  const session = await getSession();
  if (session) redirect(roleToRedirect(session.role));
  const t = await getTranslations("auth");

  return (
    <section className="shell signin-wrap">
      <article className="signin-aside">
        <h1>{t("customerLoginTitle")}</h1>
        <p>{t("customerLoginBody")}</p>
        <p className="muted">{t("noLoginYet")} <a href="/contact">{t("contactOurTeam")}</a></p>
      </article>
      <article className="signin-card">
        <h2>{t("customerAccess")}</h2>
        <SignInForm role="CUSTOMER" />
      </article>
    </section>
  );
}
