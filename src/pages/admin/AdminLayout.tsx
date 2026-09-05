import { Briefcase, FileText, FolderCheck, Inbox, LayoutDashboard, Users, UserCog } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PortalLayout, type PortalNavItem } from "@/components/layout/PortalLayout";

const items: PortalNavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/candidates", label: "Candidates", icon: Users },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/documents", label: "Document queue", icon: FolderCheck },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/users", label: "Users & roles", icon: UserCog },
];

export default function AdminLayout() {
  return (
    <>
      <Seo title="Admin console" description="Staff console" path="/admin" noindex />
      <PortalLayout title="Staff console" subtitle="Admin" items={items} />
    </>
  );
}
