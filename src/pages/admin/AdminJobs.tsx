import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/misc";
import { requireSupabase } from "@/lib/supabase";
import type { JobRow } from "@/lib/database.types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminJobs() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: async () => {
      const { data: rows, error: queryError } = await requireSupabase()
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (queryError) throw queryError;
      return (rows ?? []) as JobRow[];
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-display-sm">Jobs</h1>
        <p className="mt-2 text-muted-foreground">Vacancies across all employers. Only staff and the owning employer can edit.</p>
      </header>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error instanceof Error ? error.message : "Could not load jobs"}
        </p>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <caption className="sr-only">Jobs</caption>
            <thead className="bg-secondary text-left">
              <tr>
                <th scope="col" className="p-4 font-semibold">Title</th>
                <th scope="col" className="p-4 font-semibold">Status</th>
                <th scope="col" className="p-4 font-semibold">Salary</th>
                <th scope="col" className="p-4 font-semibold">Vacancies</th>
                <th scope="col" className="p-4 font-semibold">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {(data ?? []).map((job) => (
                <tr key={job.id}>
                  <td className="p-4 font-medium">{job.title}</td>
                  <td className="p-4">
                    <Badge variant={job.status === "open" ? "success" : "soft"}>{job.status}</Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatCurrency(job.salary_min, job.currency)} – {formatCurrency(job.salary_max, job.currency)}
                  </td>
                  <td className="p-4 text-muted-foreground">{job.vacancies}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(job.deadline)}</td>
                </tr>
              ))}
              {(data ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No jobs in the database yet. Seed data lives in supabase/migrations/0003_seed.sql.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
