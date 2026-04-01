import { redirect } from "next/navigation";
import { getSession, roleToRedirect } from "@/lib/auth";
import { SignInForm } from "@/components/site/sign-in-form";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect(roleToRedirect(session.role));

  return (
    <section className="shell signin-wrap">
      <article className="signin-aside">
        <h1>Admin Login</h1>
        <p>Restricted access for platform administration, operations, and content governance.</p>
      </article>
      <article className="signin-card">
        <h2>Admin access</h2>
        <SignInForm role="ADMIN" />
      </article>
    </section>
  );
}
