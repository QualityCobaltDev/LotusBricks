import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <section className="card card-body" style={{ maxWidth: 560 }}>
      <h1>Forgot password</h1>
      <ForgotPasswordForm />
    </section>
  );
}
