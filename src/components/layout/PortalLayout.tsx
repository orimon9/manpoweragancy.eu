import { NavLink, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

export type PortalNavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; end?: boolean };

export function PortalLayout({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: PortalNavItem[];
}) {
  const { user, roles, signOut } = useAuth();

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[260px_1fr] lg:py-14">
      <aside>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="font-display text-lg font-bold">{title}</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">{user?.email ?? subtitle}</p>
          {roles.length ? (
            <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{roles.join(" · ")}</p>
          ) : null}
        </div>

        <nav className="mt-4 flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-2 lg:flex-col lg:overflow-visible" aria-label={title}>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button variant="ghost" className="mt-4 w-full justify-start text-muted-foreground" onClick={() => void signOut()}>
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </Button>
      </aside>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
