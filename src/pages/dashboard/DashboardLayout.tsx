import { Bell, CalendarDays, FileText, FolderOpen, LayoutDashboard, UserRound } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PortalLayout, type PortalNavItem } from "@/components/layout/PortalLayout";

const items: PortalNavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/applications", label: "Applications", icon: FileText },
  { to: "/dashboard/documents", label: "Documents", icon: FolderOpen },
  { to: "/dashboard/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/dashboard/messages", label: "Messages", icon: Bell },
  { to: "/dashboard/profile", label: "Profile", icon: UserRound },
];

export default function DashboardLayout() {
  return (
    <>
      <Seo title="My dashboard" description="Track your applications, documents and appointments." path="/dashboard" noindex />
      <PortalLayout title="Client portal" subtitle="Candidate" items={items} />
    </>
  );
}
