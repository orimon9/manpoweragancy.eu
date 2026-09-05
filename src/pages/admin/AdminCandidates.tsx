import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, Skeleton } from "@/components/ui/misc";
import { useAdminCandidates } from "@/lib/queries";

export default function AdminCandidates() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useAdminCandidates(search);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-display-sm">Candidates</h1>
        <p className="mt-2 text-muted-foreground">Every registered candidate profile, readable by staff only.</p>
      </header>

      <Card>
        <CardContent className="p-5 pt-5">
          <Label htmlFor="candidate-search">Search by name</Label>
          <Input
            id="candidate-search"
            className="mt-2 max-w-sm"
            placeholder="Maria"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error instanceof Error ? error.message : "Could not load candidates"}
        </p>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <caption className="sr-only">Candidates</caption>
            <thead className="bg-secondary text-left">
              <tr>
                <th scope="col" className="p-4 font-semibold">Name</th>
                <th scope="col" className="p-4 font-semibold">Email</th>
                <th scope="col" className="p-4 font-semibold">Nationality</th>
                <th scope="col" className="p-4 font-semibold">Experience</th>
                <th scope="col" className="p-4 font-semibold">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {(data ?? []).map((candidate) => (
                <tr key={candidate.id}>
                  <td className="p-4 font-medium">{candidate.full_name ?? "—"}</td>
                  <td className="p-4 text-muted-foreground">{candidate.email ?? "—"}</td>
                  <td className="p-4 text-muted-foreground">{candidate.nationality ?? "—"}</td>
                  <td className="p-4 text-muted-foreground">
                    {candidate.years_experience === null ? "—" : candidate.years_experience + " yrs"}
                  </td>
                  <td className="p-4">
                    <Progress value={candidate.profile_completion ?? 0} className="w-28" />
                  </td>
                </tr>
              ))}
              {(data ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No candidates found.
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
