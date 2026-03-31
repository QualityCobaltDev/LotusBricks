import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { routes } from "@/lib/routes";

const links = [
  { label: "Overview", href: routes.account },
  { label: "Saved", href: routes.accountSaved },
  { label: "Viewings", href: routes.accountViewings },
  { label: "Profile", href: routes.accountProfile }
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout title="Account" links={links}>{children}</DashboardLayout>;
}
