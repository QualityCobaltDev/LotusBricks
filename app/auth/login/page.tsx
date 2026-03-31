import type { Metadata } from "next";
import { Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Access your RightBricks dashboard."
};

export default function LoginPage() {
  return (
    <Section className="py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Auth integration is pending. Use dashboard shells for UI validation.</p>
      </div>
    </Section>
  );
}
