import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { useAdminInquiries } from "@/lib/queries";
import { requireSupabase } from "@/lib/supabase";
import type { InquiryStatus } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

const COLUMNS: { status: InquiryStatus; label: string }[] = [
  { status: "new", label: "New" },
  { status: "contacted", label: "Contacted" },
  { status: "qualified", label: "Qualified" },
  { status: "converted", label: "Converted" },
  { status: "closed", label: "Closed" },
];

export default function AdminInquiries() {
  const { data, isLoading, error } = useAdminInquiries();
  const queryClient = useQueryClient();

  const move = async (id: string, status: InquiryStatus) => {
    try {
      const { error: updateError } = await requireSupabase().from("inquiries").update({ status }).eq("id", id);
      if (updateError) throw updateError;
      await queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      toast.success("Inquiry moved to " + status);
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-display-sm">Inquiries</h1>
        <p className="mt-2 text-muted-foreground">
          Inbound leads from the contact form. Anonymous visitors can create these but can never read them back.
        </p>
      </header>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error instanceof Error ? error.message : "Could not load inquiries"}
        </p>
      ) : null}

      {isLoading ? <Skeleton className="h-64 w-full" /> : null}

      {!isLoading && (data ?? []).length === 0 ? (
        <EmptyState title="No inquiries yet" description="Messages sent through the contact form land here." />
      ) : null}

      {(data ?? []).length > 0 ? (
        <div className="grid gap-4 overflow-x-auto lg:grid-cols-5">
          {COLUMNS.map((column) => {
            const items = (data ?? []).filter((inquiry) => inquiry.status === column.status);
            return (
              <section key={column.status} className="min-w-[240px] rounded-lg border border-border bg-secondary/40 p-3">
                <h2 className="flex items-center justify-between text-sm font-semibold">
                  {column.label}
                  <Badge variant="soft">{items.length}</Badge>
                </h2>
                <ul className="mt-3 space-y-3">
                  {items.map((inquiry) => (
                    <li key={inquiry.id} className="rounded-md border border-border bg-card p-4">
                      <p className="font-medium">{inquiry.full_name}</p>
                      <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{inquiry.message}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{formatDate(inquiry.created_at)}</p>
                      <Select
                        className="mt-3 h-9 text-xs"
                        value={inquiry.status}
                        onChange={(e) => void move(inquiry.id, e.target.value as InquiryStatus)}
                        aria-label={"Change status for " + inquiry.full_name}
                      >
                        {COLUMNS.map((option) => (
                          <option key={option.status} value={option.status}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
