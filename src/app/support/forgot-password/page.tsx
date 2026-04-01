import { CONTACT } from "@/lib/contact";

export default function ForgotPasswordPage() {
  return (
    <section className="shell section narrow">
      <h1>Reset your password</h1>
      <p className="muted">Enter your account email and we will send reset instructions when SMTP reset is enabled.</p>
      <form className="stack-form card-pad">
        <label htmlFor="email">Account email<input id="email" name="email" type="email" required /></label>
        <button className="btn btn-primary" type="submit">Request reset link</button>
        <p className="muted">Need immediate help? <a href={CONTACT.emailHref}>{CONTACT.email}</a></p>
      </form>
    </section>
  );
}
