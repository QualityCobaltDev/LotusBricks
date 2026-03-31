import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "brand" | "default";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "success" && "bg-emerald-100 text-emerald-800",
        tone === "brand" && "bg-brand-100 text-brand-700",
        tone === "default" && "bg-amber-100 text-amber-800",
        tone === "neutral" && "bg-slate-100 text-slate-700"
      )}
    >
      {children}
    </span>
  );
}
