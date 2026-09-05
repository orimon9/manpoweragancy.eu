import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/misc";
import { useAuth } from "@/providers/AuthProvider";
import { useApplicationTimeline, useMyApplications } from "@/lib/queries";
import { APPLICATION_STATUS_LABELS } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

export default function DashboardApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const applications = useMyApplications(user?.id);
  const timeline = useApplicationTimeline(id);

  const application = (applications.data ?? []).find((item) => item.id === id);

  if (applications.isLoading) return <Skeleton className="h-96 w-full" />;

  if (!application) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">We could not find that application on your account.</p>
        <Button asChild variant="outline">
          <Link to="/dashboard/applications">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to applications
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="px-0">
          <Link to="/dashboard/applications">
            <ArrowLeft className="h-4 w-4" aria-hidden /> All applications
          </Link>
        </Button>
        <h1 className="mt-3 font-display text-display-sm">{application.reference_code}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Badge variant={application.status === "approved" || application.status === "deployed" ? "success" : "soft"}>
            {APPLICATION_STATUS_LABELS[application.status]}
          </Badge>
          <span className="text-sm text-muted-foreground">Opened {formatDate(application.created_at)}</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 pt-6">
          <h2 className="text-lg">Status timeline</h2>

          {timeline.isLoading ? (
            <Skeleton className="mt-4 h-40 w-full" />
          ) : (timeline.data ?? []).length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No status changes recorded yet. You will see every step here as your file progresses.
            </p>
          ) : (
            <ol className="mt-6">
              {(timeline.data ?? []).map((event, index, all) => (
                <li key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                    </span>
                    {index < all.length - 1 ? <span className="w-px flex-1 bg-border" aria-hidden /> : null}
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold">{APPLICATION_STATUS_LABELS[event.to_status]}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(event.created_at)}</p>
                    {event.note ? <p className="mt-1 text-sm text-muted-foreground">{event.note}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      {application.notes ? (
        <Card>
          <CardContent className="p-6 pt-6">
            <h2 className="text-lg">Application details</h2>
            <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{application.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="p-6 pt-6">
          <h2 className="text-lg">Need to change something?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Applications can only be edited by you while they are still a draft. Once submitted, ask your consultant to make
            changes so the audit trail stays intact.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/contact">Message my consultant</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
