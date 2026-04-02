import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/server/guards";
import { ControlCenterShell } from "@/components/admin/control-center-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <ControlCenterShell>{children}</ControlCenterShell>;
}
