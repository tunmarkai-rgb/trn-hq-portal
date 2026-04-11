import { useEffect, useState } from "react";
import { CalendarDays, ExternalLink, Play, Clock, Check, HelpCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { format, isPast } from "date-fns";

const eventTypeColors: Record<string, string> = {
  Masterclass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Training: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Community Call": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Guest Speaker": "bg-gold/10 text-gold border-gold/20",
  Call: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Webinar: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, string>>({});
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const [eventsRes, rsvpRes] = await Promise.all([
      supabase.from("events").select("*").order("event_date", { ascending: false }),
      user ? (supabase.from("event_rsvps" as any).select("*") as any).eq("user_id", user.id) : Promise.resolve({ data: [] }),
    ]);
    if (eventsRes.error) {
      toast({ title: "Failed to load events", description: eventsRes.error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const now = new Date().toISOString();
    const allEvents = eventsRes.data || [];
    setUpcoming(allEvents.filter((e: any) => e.event_date >= now).reverse());
    setPast(allEvents.filter((e: any) => e.event_date < now));

    const rsvpMap: Record<string, string> = {};
    (rsvpRes.data || []).forEach((r: any) => { rsvpMap[r.event_id] = r.status; });
    setRsvps(rsvpMap);

    // Get RSVP counts for upcoming
    const upcomingIds = allEvents.filter((e: any) => e.event_date >= now).map((e: any) => e.id);
    if (upcomingIds.length > 0) {
      const { data: countData } = await (supabase.from("event_rsvps" as any).select("event_id") as any).eq("status", "going").in("event_id", upcomingIds);
      const counts: Record<string, number> = {};
      (countData || []).forEach((r: any) => { counts[r.event_id] = (counts[r.event_id] || 0) + 1; });
      setRsvpCounts(counts);
    }

    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, [user]);

  const handleRsvp = async (eventId: string, status: string) => {
    if (!user) return;
    if (rsvps[eventId]) {
      if (rsvps[eventId] === status) {
        await (supabase.from("event_rsvps" as any).delete() as any).eq("event_id", eventId).eq("user_id", user.id);
        toast({ title: "RSVP removed" });
      } else {
        await (supabase.from("event_rsvps" as any).update({ status }) as any).eq("event_id", eventId).eq("user_id", user.id);
        toast({ title: `Updated to ${status}` });
      }
    } else {
      await (supabase.from("event_rsvps" as any).insert as any)({ event_id: eventId, user_id: user.id, status });
      toast({ title: `RSVP: ${status}` });
    }
    fetchEvents();
  };

  if (loading) return (
    <div className="space-y-4 max-w-4xl">
      <div className="h-8 w-32 bg-secondary/40 rounded-md animate-pulse" />
      <div className="grid md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 bg-secondary/30 rounded-xl animate-pulse" />)}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Calls & Events</h2>
        <p className="font-body text-sm text-muted-foreground">Masterminds, training, guest speakers — never miss a call</p>
      </div>

      {/* Upcoming */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gold" /> Upcoming
        </h3>
        {upcoming.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">No upcoming events scheduled.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((e, i) => {
              const myRsvp = rsvps[e.id];
              const goingCount = rsvpCounts[e.id] || 0;
              return (
                <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-2xl p-6 hover:border-gold/20 transition-all duration-300 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gold/10 flex flex-col items-center justify-center shrink-0">
                      <span className="font-display text-lg font-bold text-gold leading-none">{e.event_date ? format(new Date(e.event_date), "d") : "?"}</span>
                      <span className="font-body text-[10px] text-gold/70 uppercase">{e.event_date ? format(new Date(e.event_date), "MMM") : ""}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-base font-semibold text-foreground">{e.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className={`${eventTypeColors[e.event_type] || "bg-secondary text-muted-foreground"} font-body text-[10px]`}>{e.event_type}</Badge>
                        <span className="font-body text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />{e.event_date ? format(new Date(e.event_date), "h:mm a") : ""}
                        </span>
                        {goingCount > 0 && (
                          <span className="font-body text-[10px] text-emerald-400">{goingCount} going</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {e.speaker && <p className="font-body text-xs text-gold/80">Host: {e.speaker}</p>}
                  {e.description && <p className="font-body text-sm text-muted-foreground">{e.description}</p>}

                  {/* RSVP + Join */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-1">
                      {[
                        { status: "going", icon: Check, label: "Going", color: "emerald" },
                        { status: "maybe", icon: HelpCircle, label: "Maybe", color: "yellow" },
                        { status: "not_going", icon: X, label: "Can't", color: "red" },
                      ].map((opt) => (
                        <Button
                          key={opt.status}
                          size="sm"
                          variant={myRsvp === opt.status ? "default" : "outline"}
                          onClick={() => handleRsvp(e.id, opt.status)}
                          className={`font-body text-xs h-8 ${
                            myRsvp === opt.status
                              ? opt.color === "emerald" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : opt.color === "yellow" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          <opt.icon className="w-3 h-3 mr-1" /> {opt.label}
                        </Button>
                      ))}
                    </div>
                    {e.join_link && (
                      <a href={e.join_link} target="_blank" rel="noopener noreferrer" className="ml-auto">
                        <Button size="sm" className="bg-gold hover:bg-gold-dark text-primary-foreground font-body text-xs h-8">
                          <ExternalLink className="w-3 h-3 mr-1" /> Join
                        </Button>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Events */}
      {past.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Play className="w-4 h-4 text-muted-foreground" /> Past Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {past.map((e) => (
              <div key={e.id} className="bg-card border border-border rounded-xl p-4 space-y-2 opacity-80">
                <div className="flex items-center justify-between">
                  <h4 className="font-body text-sm font-medium text-foreground">{e.title}</h4>
                  <span className="font-body text-[10px] text-muted-foreground">{e.event_date ? format(new Date(e.event_date), "MMM d, yyyy") : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${eventTypeColors[e.event_type] || "bg-secondary text-muted-foreground"} font-body text-[10px]`}>{e.event_type}</Badge>
                  {e.speaker && <span className="font-body text-[10px] text-muted-foreground">{e.speaker}</span>}
                </div>
                {e.summary && <p className="font-body text-xs text-muted-foreground">{e.summary}</p>}
                {e.recording_url && (
                  <a href={e.recording_url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1">
                    <Play className="w-3 h-3" /> Watch Recording
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
