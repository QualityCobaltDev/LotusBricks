import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "success";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "success" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
      )}
    >
      {children}
    </span>
  );
}
