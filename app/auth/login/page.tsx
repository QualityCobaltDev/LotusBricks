import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/site/section";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Sign In", description: "Sign in to your RightBricks account." };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user?.role === "ADMIN" || user?.role === "OPS") redirect("/admin");
  if (user) redirect("/account");

  return (
    <Section className="py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">Sign in</h1>
        <p className="mt-2 text-sm text-neutral-600">Access your account dashboard and saved properties.</p>
        <LoginForm />
        <div className="mt-4 flex justify-between text-sm">
          <Link href="/auth/register" className="text-primary-700">Create account</Link>
          <Link href="/auth/forgot-password" className="text-primary-700">Forgot password?</Link>
        </div>
      </div>
    </Section>
  );
}
