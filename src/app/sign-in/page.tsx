import { redirect } from "next/navigation";
import { getSession, roleToRedirect } from "@/lib/auth";
import { SignInForm } from "@/components/site/sign-in-form";

export default async function SignIn() {
  const session = await getSession();
  if (session) {
    redirect(roleToRedirect(session.role));
  }

  return (
    <section className="shell signin-wrap">
      <article className="signin-aside">
        <h1>Welcome back to RightBricks</h1>
        <p>Securely access saved listings, inquiries, and portfolio workflows from one trusted workspace.</p>
        <ul className="check-list">
          <li>Verified listing insights and transparent pricing context.</li>
          <li>Saved opportunities synced across your account.</li>
          <li>Fast communication with advisors and listing partners.</li>
        </ul>
      </article>

      <article className="signin-card">
        <h2>Sign in</h2>
        <SignInForm />
      </article>
    </section>
  );
}
