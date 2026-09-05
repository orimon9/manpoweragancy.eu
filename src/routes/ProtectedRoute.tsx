import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import type { AppRole } from "@/lib/database.types";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: AppRole[] }) {
  const { user, roles, loading, configured } = useAuth();
  const location = useLocation();

  if (!configured) {
    return <Navigate to="/backend-required" replace state={{ from: location.pathname }} />;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
        <span className="sr-only">Checking your session…</span>
      </div>
    );
  }

  if (!user) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={"/auth?redirectTo=" + redirectTo} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.some((role) => roles.includes(role))) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
