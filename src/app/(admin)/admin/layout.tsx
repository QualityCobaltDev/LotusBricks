import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { routes } from "@/lib/routes";

const links = [
  { label: "Overview", href: routes.admin },
  { label: "Listings", href: routes.adminListings },
  { label: "Users", href: routes.adminUsers },
  { label: "Inquiries", href: routes.adminInquiries },
  { label: "Reports", href: routes.adminReports }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout title="Admin" links={links}>{children}</DashboardLayout>;
}
