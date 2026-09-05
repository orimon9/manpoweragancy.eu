import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { useAuth } from "@/providers/AuthProvider";
import { useMyApplications } from "@/lib/queries";
import { APPLICATION_STATUS_LABELS } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

export default function DashboardApplications() {
  const { user } = useAuth();
  const { data, isLoading, error } = useMyApplications(user?.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-display-sm">Applications</h1>
        <p className="mt-2 text-muted-foreground">Every file we have open for you, with its live status.</p>
      </header>

      {isLoading ? <Skeleton className="h-40 w-full" /> : null}

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          Could not load your applications: {error instanceof Error ? error.message : "unknown error"}
        </p>
      ) : null}

      {!isLoading && (data ?? []).length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="No applications yet"
          description="When you submit an application it appears here with a reference code and a full status timeline."
          action={
            <Button asChild>
              <Link to="/apply">Start an application</Link>
            </Button>
          }
        />
      ) : null}

      <ul className="space-y-3">
        {(data ?? []).map((application) => (
          <li key={application.id}>
            <Link
              to={"/dashboard/applications/" + application.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-secondary"
            >
              <div>
                <p className="font-display text-lg font-bold">{application.reference_code}</p>
                <p className="text-sm text-muted-foreground">
                  Opened {formatDate(application.created_at)}
                  {application.submitted_at ? " · submitted " + formatDate(application.submitted_at) : ""}
                </p>
              </div>
              <Badge variant={application.status === "approved" || application.status === "deployed" ? "success" : "soft"}>
                {APPLICATION_STATUS_LABELS[application.status]}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
