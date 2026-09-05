import { CalendarDays, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { useAuth } from "@/providers/AuthProvider";
import { useMyAppointments } from "@/lib/queries";
import type { AppointmentRow } from "@/lib/database.types";

function toIcsDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function downloadIcs(appointment: AppointmentRow) {
  const end = new Date(new Date(appointment.scheduled_at).getTime() + appointment.duration_min * 60_000).toISOString();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Manpower Global Agency//EN",
    "BEGIN:VEVENT",
    "UID:" + appointment.id,
    "DTSTAMP:" + toIcsDate(new Date().toISOString()),
    "DTSTART:" + toIcsDate(appointment.scheduled_at),
    "DTEND:" + toIcsDate(end),
    "SUMMARY:" + appointment.title,
    appointment.location ? "LOCATION:" + appointment.location : "",
    appointment.meeting_url ? "URL:" + appointment.meeting_url : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "appointment.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function DashboardAppointments() {
  const { user } = useAuth();
  const { data, isLoading } = useMyAppointments(user?.id);

  const now = Date.now();
  const upcoming = (data ?? []).filter((item) => new Date(item.scheduled_at).getTime() >= now);
  const past = (data ?? []).filter((item) => new Date(item.scheduled_at).getTime() < now);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display-sm">Appointments</h1>
        <p className="mt-2 text-muted-foreground">Consultations, document reviews and embassy appointments.</p>
      </header>

      {isLoading ? <Skeleton className="h-40 w-full" /> : null}

      {!isLoading && (data ?? []).length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-5 w-5" />}
          title="No appointments scheduled"
          description="Your consultant will book a slot with you as soon as your documents are reviewed."
        />
      ) : null}

      {[
        { title: "Upcoming", list: upcoming },
        { title: "Past", list: past },
      ].map((group) =>
        group.list.length ? (
          <section key={group.title}>
            <h2 className="text-xl">{group.title}</h2>
            <ul className="mt-4 space-y-3">
              {group.list.map((appointment) => (
                <li
                  key={appointment.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-5"
                >
                  <div>
                    <p className="font-medium">{appointment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short" }).format(
                        new Date(appointment.scheduled_at)
                      )}{" "}
                      · {appointment.duration_min} min
                    </p>
                    {appointment.location ? <p className="text-sm text-muted-foreground">{appointment.location}</p> : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="soft">{appointment.mode ?? "in person"}</Badge>
                    {group.title === "Upcoming" ? (
                      <Button variant="outline" size="sm" onClick={() => downloadIcs(appointment)}>
                        <Download className="h-4 w-4" aria-hidden /> Add to calendar
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}
    </div>
  );
}
