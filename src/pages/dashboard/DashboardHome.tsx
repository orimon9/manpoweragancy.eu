import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, FileText, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, Progress, Skeleton } from "@/components/ui/misc";
import { useAuth } from "@/providers/AuthProvider";
import { useMyAppointments, useMyApplications, useMyDocuments, useProfile } from "@/lib/queries";
import { APPLICATION_STATUS_LABELS } from "@/lib/database.types";
import { jobs } from "@/content/site";
import { formatDate } from "@/lib/utils";

export default function DashboardHome() {
  const { user } = useAuth();
  const profile = useProfile(user?.id);
  const applications = useMyApplications(user?.id);
  const documents = useMyDocuments(user?.id);
  const appointments = useMyAppointments(user?.id);

  const completion = profile.data?.profile_completion ?? 0;
  const nextAppointment = (appointments.data ?? []).find((item) => new Date(item.scheduled_at) > new Date());
  const verified = (documents.data ?? []).filter((doc) => doc.status === "verified").length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display-sm">Welcome back{profile.data?.full_name ? ", " + profile.data.full_name.split(" ")[0] : ""}</h1>
        <p className="mt-2 text-muted-foreground">Here is where your immigration file stands today.</p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 pt-6">
            <p className="text-sm text-muted-foreground">Profile completion</p>
            {profile.isLoading ? (
              <Skeleton className="mt-3 h-8 w-20" />
            ) : (
              <>
                <p className="mt-2 font-display text-3xl font-bold">{completion}%</p>
                <Progress value={completion} className="mt-3" />
                {completion < 100 ? (
                  <Button asChild variant="link" className="mt-2 h-auto px-0 text-sm">
                    <Link to="/dashboard/profile">Complete your profile</Link>
                  </Button>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 pt-6">
            <p className="text-sm text-muted-foreground">Active applications</p>
            {applications.isLoading ? (
              <Skeleton className="mt-3 h-8 w-12" />
            ) : (
              <p className="mt-2 font-display text-3xl font-bold">{applications.data?.length ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 pt-6">
            <p className="text-sm text-muted-foreground">Documents verified</p>
            {documents.isLoading ? (
              <Skeleton className="mt-3 h-8 w-16" />
            ) : (
              <p className="mt-2 font-display text-3xl font-bold">
                {verified}
                <span className="text-lg text-muted-foreground">/{documents.data?.length ?? 0}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 pt-6">
            <p className="text-sm text-muted-foreground">Next appointment</p>
            {appointments.isLoading ? (
              <Skeleton className="mt-3 h-8 w-24" />
            ) : nextAppointment ? (
              <>
                <p className="mt-2 font-display text-lg font-bold">{formatDate(nextAppointment.scheduled_at)}</p>
                <p className="text-sm text-muted-foreground">{nextAppointment.title}</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">None scheduled</p>
            )}
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Your applications</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard/applications">
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-4">
          {applications.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (applications.data ?? []).length === 0 ? (
            <EmptyState
              icon={<FileText className="h-5 w-5" />}
              title="No applications yet"
              description="Start an application and we will open a file, assign a consultant and give you a reference code."
              action={
                <Button asChild>
                  <Link to="/apply">Start an application</Link>
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {(applications.data ?? []).slice(0, 3).map((application) => (
                <li key={application.id}>
                  <Link
                    to={"/dashboard/applications/" + application.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-secondary"
                  >
                    <span>
                      <span className="block font-display font-bold">{application.reference_code}</span>
                      <span className="block text-sm text-muted-foreground">Opened {formatDate(application.created_at)}</span>
                    </span>
                    <Badge variant={application.status === "approved" || application.status === "deployed" ? "success" : "soft"}>
                      {APPLICATION_STATUS_LABELS[application.status]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6 pt-6">
            <h2 className="flex items-center gap-2 text-lg">
              <FolderOpen className="h-5 w-5 text-teal" aria-hidden /> Document checklist
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {documents.data?.length
                ? verified + " of " + documents.data.length + " uploaded documents verified."
                : "No documents uploaded yet."}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/dashboard/documents">Manage documents</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 pt-6">
            <h2 className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-accent" aria-hidden /> Recommended for you
            </h2>
            <ul className="mt-4 space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <li key={job.slug}>
                  <Link to={"/jobs/" + job.slug} className="block text-sm hover:underline">
                    <span className="font-medium">{job.title}</span>
                    <span className="block text-muted-foreground">{job.location}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
