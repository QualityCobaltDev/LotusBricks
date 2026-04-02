import type { ReactNode } from "react";
import { requireAdmin } from "@/server/guards";
import { ControlCenterShell } from "@/components/admin/control-center-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <ControlCenterShell>{children}</ControlCenterShell>;
}
