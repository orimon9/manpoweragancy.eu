import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, FolderOpen, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { useAuth } from "@/providers/AuthProvider";
import { useMyDocuments } from "@/lib/queries";
import { requireSupabase } from "@/lib/supabase";
import { DOCUMENT_TYPE_LABELS, type DocStatus, type DocumentType } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];

const statusVariant: Record<DocStatus, "success" | "warning" | "destructive" | "soft"> = {
  verified: "success",
  pending: "warning",
  rejected: "destructive",
  expired: "soft",
};

export default function DashboardDocuments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useMyDocuments(user?.id);

  const [docType, setDocType] = useState<DocumentType>("passport");
  const [consent, setConsent] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    if (!user) return;

    if (!consent) {
      toast.error("Please confirm the consent checkbox before uploading");
      return;
    }
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Only PDF, JPG and PNG files are accepted");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File must be 10 MB or smaller");
      return;
    }

    setBusy(true);
    try {
      const supabase = requireSupabase();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      // Path convention enforced by the storage RLS policy: {user_id}/...
      const path = user.id + "/" + Date.now() + "-" + safeName;

      const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("documents").insert({
        owner_id: user.id,
        doc_type: docType,
        file_path: path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        status: "pending",
      });
      if (insertError) throw insertError;

      await queryClient.invalidateQueries({ queryKey: ["documents", user.id] });
      toast.success("Uploaded", { description: file.name + " is queued for verification." });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const preview = async (path: string) => {
    try {
      const { data: signed, error } = await requireSupabase().storage.from("documents").createSignedUrl(path, 60);
      if (error) throw error;
      window.open(signed.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not open document");
    }
  };

  const remove = async (id: string, path: string) => {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    try {
      const supabase = requireSupabase();
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
      await supabase.storage.from("documents").remove([path]);
      await queryClient.invalidateQueries({ queryKey: ["documents", user?.id] });
      toast.success("Document deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display-sm">Documents</h1>
        <p className="mt-2 text-muted-foreground">
          Upload the documents your consultant asks for. Files are private, encrypted at rest and opened only through
          short-lived links.
        </p>
      </header>

      <Card>
        <CardContent className="p-6 pt-6">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <Label htmlFor="doc-type">Document type</Label>
              <Select id="doc-type" className="mt-2" value={docType} onChange={(e) => setDocType(e.target.value as DocumentType)}>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
            />
            <span className="text-muted-foreground">
              I consent to Manpower Global Agency SRL storing and processing this document for my immigration application.
              I understand documents are retained for five years after my case closes, and that I can request deletion at
              any time.
            </span>
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) void upload(file);
            }}
            className={
              "mt-5 rounded-lg border-2 border-dashed p-10 text-center transition-colors " +
              (dragging ? "border-primary bg-primary-soft" : "border-border bg-secondary/40")
            }
          >
            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">Drag a file here, or</p>
            <label className="mt-3 inline-block">
              <span className="sr-only">Choose a file to upload</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={busy || !consent}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                  e.target.value = "";
                }}
                className="block text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
              />
            </label>
            <p className="mt-3 text-xs text-muted-foreground">PDF, JPG or PNG · up to 10 MB</p>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-xl">Your documents</h2>
        <div className="mt-4">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (data ?? []).length === 0 ? (
            <EmptyState icon={<FolderOpen className="h-5 w-5" />} title="Nothing uploaded yet" description="Start with your passport bio page and your CV." />
          ) : (
            <ul className="space-y-3">
              {(data ?? []).map((doc) => (
                <li key={doc.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-5">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{doc.file_name ?? doc.file_path}</p>
                    <p className="text-sm text-muted-foreground">
                      {DOCUMENT_TYPE_LABELS[doc.doc_type]} · uploaded {formatDate(doc.created_at)}
                    </p>
                    {doc.status === "rejected" && doc.review_note ? (
                      <p className="mt-1 text-sm text-destructive">Rejected: {doc.review_note}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[doc.status]}>{doc.status}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => void preview(doc.file_path)} aria-label={"Preview " + (doc.file_name ?? "document")}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void remove(doc.id, doc.file_path)}
                      aria-label={"Delete " + (doc.file_name ?? "document")}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
