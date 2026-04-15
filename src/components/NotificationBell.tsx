import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    setNotifications(data || []);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    if (!user || unreadCount === 0) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      markAllRead();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center font-body text-[9px] font-bold text-navy leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 max-w-[calc(100vw-2rem)] p-0 bg-card border-border shadow-xl"
      >
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="font-display text-sm font-semibold text-foreground">Notifications</span>
          {notifications.length > 0 && (
            <button
              onClick={fetchNotifications}
              className="font-body text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Refresh
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-6 h-6 mx-auto mb-2 text-muted-foreground/30" />
              <p className="font-body text-xs text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <a
                key={n.id}
                href={n.link || "#"}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${!n.read ? "bg-gold/5" : ""}`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                  )}
                  <div className={!n.read ? "" : "pl-3.5"}>
                    <p className="font-body text-xs font-medium text-foreground">{n.title}</p>
                    {n.message && (
                      <p className="font-body text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                    )}
                    <p className="font-body text-[10px] text-muted-foreground/50 mt-1">
                      {n.created_at ? format(new Date(n.created_at), "MMM d, h:mm a") : ""}
                    </p>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
