import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "draft" | "verified" | "featured" | "success" | "warning" | "error" | "info";
};

export function Badge({ children, tone = "draft" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "verified" && "bg-primary-100 text-primary-800",
        tone === "featured" && "bg-secondary-100 text-secondary-700",
        tone === "success" && "bg-success-100 text-success-800",
        tone === "warning" && "bg-warning-100 text-warning-800",
        tone === "error" && "bg-secondary-100 text-secondary-800",
        tone === "info" && "bg-info-100 text-info-800",
        tone === "draft" && "bg-neutral-100 text-neutral-700"
      )}
    >
      {children}
    </span>
  );
}
