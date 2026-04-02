import { ResetPasswordForm } from "@/components/site/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <section className="shell section narrow">
      <h1>Create a new password</h1>
      <p className="muted">For security, reset links expire after 30 minutes.</p>
      <ResetPasswordForm token={token} />
    </section>
  );
}
