import type { ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition",
        variant === "primary"
          ? "bg-brand-500 text-white hover:bg-brand-700"
          : "border border-slate-300 bg-white text-slate-800 hover:border-brand-500 hover:text-brand-700",
        className
      )}
    >
      {children}
    </Link>
  );
}
