import { useEffect, useState } from "react";
import { Handshake, Building2, Users, TrendingUp, ArrowUpRight, Megaphone, CalendarDays, Globe, Pin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ deals: 0, referrals: 0, members: 0, profile: null as any });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [recentOpportunities, setRecentOpportunities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      const [dealsRes, referralsRes, membersRes, profileRes, announcementsRes, eventsRes, recentMembersRes, oppsRes] = await Promise.all([
        supabase.from("deals").select("id", { count: "exact", head: true }).or(`created_by.eq.${user.id},partner_id.eq.${user.id}`),
        supabase.from("referrals").select("id", { count: "exact", head: true }).or(`sent_by.eq.${user.id},sent_to.eq.${user.id}`),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("announcements").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(4),
        supabase.from("events").select("*").gte("event_date", new Date().toISOString()).order("event_date").limit(3),
        supabase.from("profiles").select("full_name, city, country, agency, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("referral_opportunities").select("*").order("created_at", { ascending: false }).limit(3),
      ]);
      setStats({
        deals: dealsRes.count || 0,
        referrals: referralsRes.count || 0,
        members: membersRes.count || 0,
        profile: profileRes.data,
      });
      setAnnouncements(announcementsRes.data || []);
      setUpcomingEvents(eventsRes.data || []);
      setRecentMembers(recentMembersRes.data || []);
      setRecentOpportunities(oppsRes.data || []);
    };
    fetchAll();
  }, [user]);

  const statCards = [
    { icon: Users, label: "Network Members", value: stats.members, accent: "from-blue-500/20 to-blue-600/5", link: "/dashboard/directory" },
    { icon: Building2, label: "Your Deals", value: stats.deals, accent: "from-emerald-500/20 to-emerald-600/5", link: "/dashboard/deals" },
    { icon: Handshake, label: "Referrals", value: stats.referrals, accent: "from-gold/20 to-gold/5", link: "/dashboard/referrals" },
  ];

  const eventTypeColors: Record<string, string> = {
    Masterclass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Training: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Community Call": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Guest Speaker": "bg-gold/10 text-gold border-gold/20",
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Welcome back{stats.profile?.full_name ? `, ${stats.profile.full_name}` : ""}
        </h2>
        <p className="font-body text-muted-foreground mt-1">Here's what's happening across the network.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={card.link} className="block bg-card border border-border rounded-2xl p-6 hover:border-gold/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-5">
                <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">{card.label}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-gold" />
                </div>
              </div>
              <p className="font-display text-4xl font-bold text-foreground">{card.value}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Megaphone className="w-4 h-4 text-gold" />
            <h3 className="font-display text-lg font-semibold text-foreground">Announcements</h3>
          </div>
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="group">
                <div className="flex items-start gap-2">
                  {a.pinned && <Pin className="w-3.5 h-3.5 text-gold shrink-0 mt-1" />}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm font-medium text-foreground">{a.title}</h4>
                    <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
                    <p className="font-body text-[10px] text-muted-foreground/60 mt-1.5">{format(new Date(a.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gold" />
              <h3 className="font-display text-lg font-semibold text-foreground">Upcoming Events</h3>
            </div>
            <Link to="/dashboard/events" className="font-body text-xs text-gold hover:text-gold-light transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((e) => (
              <div key={e.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex flex-col items-center justify-center shrink-0">
                  <span className="font-display text-sm font-bold text-gold leading-none">{format(new Date(e.event_date), "d")}</span>
                  <span className="font-body text-[9px] text-gold/70 uppercase">{format(new Date(e.event_date), "MMM")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body text-sm font-medium text-foreground truncate">{e.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${eventTypeColors[e.event_type] || "bg-secondary text-muted-foreground"} font-body text-[10px] px-1.5 py-0`}>{e.event_type}</Badge>
                    {e.speaker && <span className="font-body text-[10px] text-muted-foreground">{e.speaker}</span>}
                  </div>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-4">No upcoming events</p>}
          </div>
        </motion.div>

        {/* Recent Opportunities */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" />
              <h3 className="font-display text-lg font-semibold text-foreground">Latest Opportunities</h3>
            </div>
            <Link to="/dashboard/opportunities" className="font-body text-xs text-gold hover:text-gold-light transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentOpportunities.map((o) => (
              <div key={o.id} className="p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                <h4 className="font-body text-sm font-medium text-foreground">{o.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[10px] px-1.5 py-0">{o.opportunity_type}</Badge>
                  <span className="font-body text-[10px] text-muted-foreground">{[o.market_city, o.market_country].filter(Boolean).join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recently Joined */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gold" />
              <h3 className="font-display text-lg font-semibold text-foreground">Recently Joined</h3>
            </div>
            <Link to="/dashboard/directory" className="font-body text-xs text-gold hover:text-gold-light transition-colors">Directory →</Link>
          </div>
          <div className="space-y-3">
            {recentMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="font-display text-xs font-bold text-gold">{(m.full_name || "?")[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">{m.full_name || "New Member"}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{[m.city, m.country].filter(Boolean).join(", ") || "—"}{m.agency ? ` · ${m.agency}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
