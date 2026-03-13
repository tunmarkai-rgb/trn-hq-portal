import { useEffect, useState } from "react";
import { CalendarDays, ExternalLink, Play, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format, isPast } from "date-fns";

const eventTypeColors: Record<string, string> = {
  Masterclass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Training: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Community Call": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Guest Speaker": "bg-gold/10 text-gold border-gold/20",
  Call: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

const Events = () => {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
      const now = new Date().toISOString();
      setUpcoming((data || []).filter((e) => e.event_date >= now).reverse());
      setPast((data || []).filter((e) => e.event_date < now));
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-12 font-body text-muted-foreground">Loading events...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Events & Guest Speakers</h2>
        <p className="font-body text-sm text-muted-foreground">Masterminds, training sessions, and community calls</p>
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
            {upcoming.map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-2xl p-6 hover:border-gold/20 transition-all duration-300 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex flex-col items-center justify-center shrink-0">
                    <span className="font-display text-lg font-bold text-gold leading-none">{format(new Date(e.event_date), "d")}</span>
                    <span className="font-body text-[10px] text-gold/70 uppercase">{format(new Date(e.event_date), "MMM")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-base font-semibold text-foreground">{e.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${eventTypeColors[e.event_type] || "bg-secondary text-muted-foreground"} font-body text-[10px]`}>{e.event_type}</Badge>
                      <span className="font-body text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{format(new Date(e.event_date), "h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
                {e.speaker && <p className="font-body text-xs text-gold/80">Speaker: {e.speaker}</p>}
                {e.description && <p className="font-body text-sm text-muted-foreground">{e.description}</p>}
                {e.join_link && (
                  <a href={e.join_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-gold hover:bg-gold-dark text-primary-foreground font-body text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" /> Join Event
                    </Button>
                  </a>
                )}
              </motion.div>
            ))}
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
                  <span className="font-body text-[10px] text-muted-foreground">{format(new Date(e.event_date), "MMM d, yyyy")}</span>
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
