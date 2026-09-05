import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/misc";
import { useAdminApplications, useUpdateApplicationStatus } from "@/lib/queries";
import { APPLICATION_STATUS_LABELS, type ApplicationRow, type ApplicationStatus } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default function AdminApplications() {
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<ApplicationRow | null>(null);

  const { data, isLoading, error } = useAdminApplications({ status, search, page, pageSize: PAGE_SIZE });
  const updateStatus = useUpdateApplicationStatus();

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const changeStatus = async (id: string, next: ApplicationStatus) => {
    if (!window.confirm("Change status to " + APPLICATION_STATUS_LABELS[next] + "? The applicant is notified by email.")) return;
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toast.success("Status updated");
      setSelected(null);
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-display-sm">Applications</h1>
        <p className="mt-2 text-muted-foreground">Server-paginated. Internal notes are staff-only and never exposed to applicants.</p>
      </header>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-5 pt-5">
          <div className="min-w-[200px] flex-1">
            <Label htmlFor="search">Search reference</Label>
            <Input
              id="search"
              className="mt-2"
              placeholder="MGA-2026-"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              className="mt-2"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as ApplicationStatus | "all");
                setPage(0);
              }}
            >
              <option value="all">All statuses</option>
              {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error instanceof Error ? error.message : "Could not load applications"}
        </p>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <caption className="sr-only">Applications</caption>
            <thead className="bg-secondary text-left">
              <tr>
                <th scope="col" className="p-4 font-semibold">Reference</th>
                <th scope="col" className="p-4 font-semibold">Status</th>
                <th scope="col" className="p-4 font-semibold">Submitted</th>
                <th scope="col" className="p-4 font-semibold">Assigned</th>
                <th scope="col" className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {(data?.rows ?? []).map((application) => (
                <tr key={application.id}>
                  <td className="p-4 font-medium">{application.reference_code}</td>
                  <td className="p-4">
                    <Badge variant={application.status === "approved" || application.status === "deployed" ? "success" : "soft"}>
                      {APPLICATION_STATUS_LABELS[application.status]}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(application.submitted_at)}</td>
                  <td className="p-4 text-muted-foreground">{application.assigned_to ? "Assigned" : "Unassigned"}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(application)}>
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
              {(data?.rows ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No applications match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page + 1} of {totalPages} · {data?.total ?? 0} records
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" role="dialog" aria-modal="true" aria-label="Application detail">
          <div className="h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-e3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold">{selected.reference_code}</h2>
                <p className="text-sm text-muted-foreground">Opened {formatDate(selected.created_at)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>

            <div className="mt-6">
              <Label htmlFor="next-status">Change status</Label>
              <Select
                id="next-status"
                className="mt-2"
                defaultValue={selected.status}
                onChange={(e) => void changeStatus(selected.id, e.target.value as ApplicationStatus)}
              >
                {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            {selected.notes ? (
              <div className="mt-6">
                <h3 className="text-sm font-semibold">Applicant notes</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{selected.notes}</p>
              </div>
            ) : null}

            <div className="mt-6 rounded-md border border-warning/40 bg-warning/10 p-4">
              <h3 className="text-sm font-semibold">Internal notes (staff only)</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                {selected.internal_notes ?? "No internal notes yet."}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
