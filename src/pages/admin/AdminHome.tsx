import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Briefcase, FileText, FolderCheck, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/misc";
import { useAdminStats } from "@/lib/queries";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/database.types";

const SERIES = ["hsl(var(--primary))", "hsl(var(--teal))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))"];

export default function AdminHome() {
  const { data, isLoading, error } = useAdminStats();

  const kpis = [
    { label: "New inquiries", value: data?.newInquiries ?? 0, icon: Inbox },
    { label: "Applications", value: data?.totalApplications ?? 0, icon: FileText },
    { label: "Open jobs", value: data?.openJobs ?? 0, icon: Briefcase },
    { label: "Documents pending", value: data?.pendingDocuments ?? 0, icon: FolderCheck },
  ];

  const statusData = Object.entries(data?.byStatus ?? {}).map(([status, count]) => ({
    name: APPLICATION_STATUS_LABELS[status as ApplicationStatus] ?? status,
    value: count,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display-sm">Overview</h1>
        <p className="mt-2 text-muted-foreground">Live pipeline across applications, documents and inbound enquiries.</p>
      </header>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          Could not load statistics: {error instanceof Error ? error.message : "unknown error"}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-6 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <kpi.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
              </div>
              {isLoading ? <Skeleton className="mt-3 h-8 w-16" /> : <p className="mt-2 font-display text-3xl font-bold">{kpi.value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6 pt-6">
            <h2 className="text-lg">Applications over time</h2>
            <div className="mt-6 h-64">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.byMonth ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 pt-6">
            <h2 className="text-lg">Pipeline by status</h2>
            <div className="mt-6 h-64">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : statusData.length === 0 ? (
                <p className="text-sm text-muted-foreground">No applications yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={90} paddingAngle={2}>
                      {statusData.map((_, index) => (
                        <Cell key={index} fill={SERIES[index % SERIES.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
