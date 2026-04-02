import { redirect } from "next/navigation";
import { getSession, roleToRedirect } from "@/lib/auth";
import { SignInForm } from "@/components/site/sign-in-form";
import { getTranslations } from "next-intl/server";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect(roleToRedirect(session.role));
  const t = await getTranslations("auth");

  return (
    <section className="shell signin-wrap">
      <article className="signin-aside">
        <h1>{t("adminLoginTitle")}</h1>
        <p>{t("adminLoginBody")}</p>
      </article>
      <article className="signin-card">
        <h2>{t("adminAccess")}</h2>
        <SignInForm role="ADMIN" />
      </article>
    </section>
  );
}
