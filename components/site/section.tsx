import { cn } from "@/lib/utils";

type SectionProps = {
  className?: string;
  children: React.ReactNode;
};

export function Section({ className, children }: SectionProps) {
  return <section className={cn("mx-auto w-full max-w-7xl px-4 md:px-6", className)}>{children}</section>;
}
