import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { routes } from "@/lib/routes";

export default function RegisterPage() {
  return (
    <section className="card card-body" style={{ maxWidth: 560 }}>
      <h1>Register</h1>
      <RegisterForm />
      <p>Already have an account? <Link href={routes.login}>Sign in</Link>.</p>
    </section>
  );
}
