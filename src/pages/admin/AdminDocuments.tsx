import { useState } from "react";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { useAdminPendingDocuments, useReviewDocument } from "@/lib/queries";
import { requireSupabase } from "@/lib/supabase";
import { DOCUMENT_TYPE_LABELS } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

export default function AdminDocuments() {
  const { data, isLoading, error } = useAdminPendingDocuments();
  const review = useReviewDocument();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const preview = async (path: string) => {
    try {
      const { data: signed, error: signError } = await requireSupabase().storage.from("documents").createSignedUrl(path, 60);
      if (signError) throw signError;
      window.open(signed.signedUrl, "_blank", "noopener,noreferrer");
    } catch (previewError) {
      toast.error(previewError instanceof Error ? previewError.message : "Could not open document");
    }
  };

  const decide = async (id: string, status: "verified" | "rejected") => {
    if (status === "rejected" && !notes[id]?.trim()) {
      toast.error("Give a reason so the candidate knows what to fix");
      return;
    }
    try {
      await review.mutateAsync({ id, status, note: notes[id] });
      toast.success(status === "verified" ? "Document verified" : "Document rejected");
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-display-sm">Document verification queue</h1>
        <p className="mt-2 text-muted-foreground">Oldest first. Documents open through 60-second signed URLs only.</p>
      </header>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error instanceof Error ? error.message : "Could not load the queue"}
        </p>
      ) : null}

      {isLoading ? <Skeleton className="h-64 w-full" /> : null}

      {!isLoading && (data ?? []).length === 0 ? (
        <EmptyState title="Queue is clear" description="No documents are waiting for verification." />
      ) : null}

      <ul className="space-y-4">
        {(data ?? []).map((doc) => (
          <li key={doc.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{doc.file_name ?? doc.file_path}</p>
                <p className="text-sm text-muted-foreground">
                  {DOCUMENT_TYPE_LABELS[doc.doc_type]} · uploaded {formatDate(doc.created_at)} ·{" "}
                  {doc.file_size ? Math.round(doc.file_size / 1024) + " KB" : "unknown size"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => void preview(doc.file_path)}>
                <Eye className="h-4 w-4" aria-hidden /> Preview
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Input
                placeholder="Reason (required to reject)"
                value={notes[doc.id] ?? ""}
                onChange={(e) => setNotes((prev) => ({ ...prev, [doc.id]: e.target.value }))}
                className="max-w-sm"
                aria-label={"Review note for " + (doc.file_name ?? "document")}
              />
              <Button size="sm" onClick={() => void decide(doc.id, "verified")} disabled={review.isPending}>
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => void decide(doc.id, "rejected")} disabled={review.isPending}>
                Reject
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
