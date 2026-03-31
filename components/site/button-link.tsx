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
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
        variant === "primary"
          ? "bg-primary-600 text-white hover:bg-primary-700"
          : "border border-primary-300 bg-white text-primary-700 hover:bg-primary-50 hover:border-primary-500",
        className
      )}
    >
      {children}
    </Link>
  );
}
