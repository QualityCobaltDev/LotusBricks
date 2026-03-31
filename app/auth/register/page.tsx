import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Section } from "@/components/site/section";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <Section className="py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">Create your account</h1>
        <RegisterForm />
        <p className="mt-4 text-sm text-neutral-600">Already have an account? <Link className="text-primary-700" href="/auth/login">Sign in</Link></p>
      </div>
    </Section>
  );
}
