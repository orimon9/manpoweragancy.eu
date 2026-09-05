import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requireSupabase } from "@/lib/supabase";
import type {
  ApplicationRow,
  ApplicationStatus,
  AppointmentRow,
  DocumentRow,
  InquiryRow,
  NotificationRow,
  ProfileRow,
} from "@/lib/database.types";

/* ------------------------------------------------------------------ */
/* Candidate                                                           */
/* ------------------------------------------------------------------ */

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("profiles")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as ProfileRow | null;
    },
  });
}

export function useUpdateProfile(userId: string | undefined) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<ProfileRow>) => {
      const { data, error } = await requireSupabase()
        .from("profiles")
        .update(patch)
        .eq("user_id", userId!)
        .select("*")
        .single();
      if (error) throw error;
      return data as ProfileRow;
    },
    onSuccess: (data) => {
      client.setQueryData(["profile", userId], data);
      void client.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}

export function useMyApplications(userId: string | undefined) {
  return useQuery({
    queryKey: ["applications", "mine", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      // `applications_public` is a security_invoker view without internal_notes.
      const { data, error } = await requireSupabase()
        .from("applications_public")
        .select("*")
        .eq("applicant_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Omit<ApplicationRow, "internal_notes">[];
    },
  });
}

export function useApplicationTimeline(applicationId: string | undefined) {
  return useQuery({
    queryKey: ["application-events", applicationId],
    enabled: Boolean(applicationId),
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("application_events")
        .select("*")
        .eq("application_id", applicationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMyDocuments(userId: string | undefined) {
  return useQuery({
    queryKey: ["documents", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("documents")
        .select("*")
        .eq("owner_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DocumentRow[];
    },
  });
}

export function useMyAppointments(userId: string | undefined) {
  return useQuery({
    queryKey: ["appointments", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("appointments")
        .select("*")
        .eq("applicant_id", userId!)
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as AppointmentRow[];
    },
  });
}

export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: ["notifications", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("notifications")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as NotificationRow[];
    },
  });
}

/* ------------------------------------------------------------------ */
/* Staff / admin                                                       */
/* ------------------------------------------------------------------ */

export type ApplicationsFilter = { status?: ApplicationStatus | "all"; search?: string; page?: number; pageSize?: number };

export function useAdminApplications(filter: ApplicationsFilter) {
  const { status = "all", search = "", page = 0, pageSize = 20 } = filter;

  return useQuery({
    queryKey: ["admin", "applications", status, search, page, pageSize],
    queryFn: async () => {
      let query = requireSupabase()
        .from("applications")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(page * pageSize, page * pageSize + pageSize - 1);

      if (status !== "all") query = query.eq("status", status);
      if (search.trim()) query = query.ilike("reference_code", "%" + search.trim() + "%");

      const { data, error, count } = await query;
      if (error) throw error;
      return { rows: (data ?? []) as ApplicationRow[], total: count ?? 0 };
    },
    placeholderData: (previous) => previous,
  });
}

export function useUpdateApplicationStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await requireSupabase()
        .from("applications")
        .update({ status, status_changed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["admin", "applications"] });
      void client.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const supabase = requireSupabase();
      const [applications, inquiries, jobs, documents] = await Promise.all([
        supabase.from("applications").select("status, created_at"),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("documents").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      if (applications.error) throw applications.error;

      const rows = applications.data ?? [];
      const byStatus = rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.status] = (acc[row.status] ?? 0) + 1;
        return acc;
      }, {});

      const byMonth = rows.reduce<Record<string, number>>((acc, row) => {
        const key = String(row.created_at).slice(0, 7);
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {});

      return {
        totalApplications: rows.length,
        newInquiries: inquiries.count ?? 0,
        openJobs: jobs.count ?? 0,
        pendingDocuments: documents.count ?? 0,
        byStatus,
        byMonth: Object.entries(byMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-12)
          .map(([month, count]) => ({ month, count })),
      };
    },
  });
}

export function useAdminInquiries() {
  return useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as InquiryRow[];
    },
  });
}

export function useAdminPendingDocuments() {
  return useQuery({
    queryKey: ["admin", "documents", "pending"],
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("documents")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as DocumentRow[];
    },
  });
}

export function useReviewDocument() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: "verified" | "rejected"; note?: string }) => {
      const { error } = await requireSupabase()
        .from("documents")
        .update({ status, review_note: note ?? null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["admin", "documents"] });
      void client.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAdminCandidates(search: string) {
  return useQuery({
    queryKey: ["admin", "candidates", search],
    queryFn: async () => {
      let query = requireSupabase()
        .from("profiles")
        .select("id, user_id, full_name, email, phone, nationality, current_country, years_experience, profile_completion")
        .order("created_at", { ascending: false })
        .limit(100);
      if (search.trim()) query = query.ilike("full_name", "%" + search.trim() + "%");
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    placeholderData: (previous) => previous,
  });
}
