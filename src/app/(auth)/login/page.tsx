import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { routes } from "@/lib/routes";

export default function LoginPage() {
  return (
    <section className="card card-body" style={{ maxWidth: 560 }}>
      <h1>Login</h1>
      <Suspense fallback={<p>Loading login form...</p>}><LoginForm /></Suspense>
      <p>New here? <Link href={routes.register}>Create an account</Link>.</p>
    </section>
  );
}
