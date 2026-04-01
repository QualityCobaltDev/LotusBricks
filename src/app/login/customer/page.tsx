import { redirect } from "next/navigation";
import { getSession, roleToRedirect } from "@/lib/auth";
import { SignInForm } from "@/components/site/sign-in-form";

export default async function CustomerLoginPage() {
  const session = await getSession();
  if (session) redirect(roleToRedirect(session.role));

  return (
    <section className="shell signin-wrap">
      <article className="signin-aside">
        <h1>Customer Login</h1>
        <p>Login details are provided by our team after contact has been established.</p>
        <p className="muted">Haven&apos;t received login details yet? <a href="/contact">Contact our team.</a></p>
      </article>
      <article className="signin-card">
        <h2>Customer access</h2>
        <SignInForm role="CUSTOMER" />
      </article>
    </section>
  );
}
