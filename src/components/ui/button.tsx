import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "outline" | "danger";
};

export function Button({ children, className, variant = "primary", ...props }: Props) {
  const variantClass = variant === "outline" ? "btn-outline" : variant === "danger" ? "btn-danger" : "btn-primary";
  return (
    <button className={`btn ${variantClass} ${className ?? ""}`.trim()} {...props}>
      {children}
    </button>
  );
}
