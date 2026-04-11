import { useEffect, useState } from "react";
import { ArrowLeftRight, ArrowRight, Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { format } from "date-fns";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
  accepted: { label: "Connected", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: Check },
  declined: { label: "Declined", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: X },
};

const Introductions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [intros, setIntros] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"received" | "sent">("received");

  const fetchData = async () => {
    if (!user) return;
    const [introsRes, profilesRes] = await Promise.all([
      supabase.from("introductions").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, full_name, city, country, agency, role"),
    ]);
    setIntros(introsRes.data || []);
    const map: Record<string, any> = {};
    (profilesRes.data || []).forEach((p: any) => { map[p.user_id] = p; });
    setProfiles(map);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleRespond = async (id: string, status: string) => {
    const { error } = await supabase.from("introductions").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "accepted" ? "Introduction accepted" : "Introduction declined" });
      fetchData();
    }
  };

  const received = intros.filter((i) => i.target_id === user?.id);
  const sent = intros.filter((i) => i.requester_id === user?.id);
  const current = tab === "received" ? received : sent;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Introductions</h2>
        <p className="font-body text-sm text-muted-foreground">Structured connections. No spam. High trust.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/30 rounded-lg p-1 w-fit">
        {(["received", "sent"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md font-body text-sm transition-colors ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "received" ? `Received (${received.length})` : `Sent (${sent.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-secondary/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : current.length === 0 ? (
        <div className="text-center py-16 font-body text-muted-foreground">
          <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>{tab === "received" ? "No introduction requests received yet." : "You haven't requested any introductions yet."}</p>
          {tab === "sent" && <p className="text-xs mt-1">Browse the <a href="/dashboard/directory" className="text-gold hover:text-gold-light">Directory</a> to find partners.</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {current.map((intro, i) => {
            const otherUserId = tab === "received" ? intro.requester_id : intro.target_id;
            const other = profiles[otherUserId];
            const config = statusConfig[intro.status] || statusConfig.pending;

            return (
              <motion.div
                key={intro.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <span className="font-display text-sm font-bold text-gold">{(other?.full_name || "?")[0]}</span>
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{other?.full_name || "Member"}</p>
                      <p className="font-body text-[11px] text-muted-foreground">
                        {other?.role ? `${other.role} · ` : ""}{[other?.city, other?.country].filter(Boolean).join(", ") || "—"}
                        {other?.agency ? ` · ${other.agency}` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${config.color} font-body text-[10px]`}>{config.label}</Badge>
                </div>

                {intro.message && (
                  <p className="font-body text-sm text-muted-foreground bg-secondary/20 rounded-lg p-3 italic">"{intro.message}"</p>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-body text-[11px] text-muted-foreground">{intro.created_at ? format(new Date(intro.created_at), "MMM d, yyyy") : ""}</span>

                  {tab === "received" && intro.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleRespond(intro.id, "accepted")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-body text-xs h-8">
                        <Check className="w-3 h-3 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRespond(intro.id, "declined")} className="border-border text-muted-foreground hover:text-destructive font-body text-xs h-8">
                        <X className="w-3 h-3 mr-1" /> Decline
                      </Button>
                    </div>
                  )}

                  {intro.status === "accepted" && other?.full_name && (
                    <span className="font-body text-[11px] text-emerald-400">Connected — reach out directly</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Introductions;
