import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { useAuth } from "@/providers/AuthProvider";
import { useNotifications } from "@/lib/queries";
import { requireSupabase, supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export default function DashboardMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useNotifications(user?.id);

  // Realtime: new notifications arrive without a refresh.
  useEffect(() => {
    const client = supabase;
    if (!client || !user) return;

    const channel = client
      .channel("notifications:" + user.id)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: "user_id=eq." + user.id },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        }
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [user, queryClient]);

  const markAllRead = async () => {
    if (!user) return;
    await requireSupabase().from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    await queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
  };

  const unread = (data ?? []).filter((item) => !item.is_read).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-sm">Messages</h1>
          <p className="mt-2 text-muted-foreground">Status changes, document requests and appointment confirmations.</p>
        </div>
        {unread > 0 ? (
          <Button variant="outline" onClick={() => void markAllRead()}>
            Mark all read ({unread})
          </Button>
        ) : null}
      </header>

      {isLoading ? <Skeleton className="h-40 w-full" /> : null}

      {!isLoading && (data ?? []).length === 0 ? (
        <EmptyState
          icon={<Bell className="h-5 w-5" />}
          title="No messages yet"
          description="We will notify you here every time your application status changes."
        />
      ) : null}

      <ul className="space-y-3">
        {(data ?? []).map((notification) => (
          <li
            key={notification.id}
            className={
              "rounded-lg border p-5 " +
              (notification.is_read ? "border-border bg-card" : "border-primary/30 bg-primary-soft")
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="font-medium">{notification.title}</p>
              {!notification.is_read ? <Badge>New</Badge> : null}
            </div>
            {notification.body ? <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p> : null}
            <p className="mt-2 text-xs text-muted-foreground">{formatDate(notification.created_at)}</p>
            {notification.link ? (
              <Button asChild variant="link" className="mt-1 h-auto px-0 text-sm">
                <Link to={notification.link}>Open</Link>
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
