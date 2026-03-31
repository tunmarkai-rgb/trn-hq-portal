import { useEffect, useState } from "react";
import { Users, TrendingUp, ArrowUpRight, CalendarDays, Globe, ArrowLeftRight, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ members: 0, countries: 0, opportunities: 0, introductions: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentOpportunities, setRecentOpportunities] = useState<any[]>([]);
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      const [profileRes, membersRes, oppsRes, eventsRes, recentMembersRes, introsRes, profilesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("profiles").select("country"),
        supabase.from("referral_opportunities").select("*").order("created_at", { ascending: false }).limit(4),
        supabase.from("events").select("*").gte("event_date", new Date().toISOString()).order("event_date").limit(3),
        supabase.from("profiles").select("full_name, city, country, agency, role, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("introductions").select("id", { count: "exact", head: true }).or(`requester_id.eq.${user.id},target_id.eq.${user.id}`),
        supabase.from("profiles").select("user_id, full_name"),
      ]);

      setProfile(profileRes.data);
      const allMembers = membersRes.data || [];
      const uniqueCountries = new Set(allMembers.map((m: any) => m.country).filter(Boolean));

      const profileMap: Record<string, string> = {};
      (profilesRes.data || []).forEach((p: any) => { profileMap[p.user_id] = p.full_name || "Member"; });
      setProfiles(profileMap);

      setStats({
        members: allMembers.length,
        countries: uniqueCountries.size,
        opportunities: (oppsRes.data || []).length,
        introductions: introsRes.count || 0,
      });
      setUpcomingEvents(eventsRes.data || []);
      setRecentOpportunities(oppsRes.data || []);
      setRecentMembers(recentMembersRes.data || []);
    };
    fetchAll();
  }, [user]);

  const isProfileIncomplete = profile && (!profile.full_name || !profile.city || !profile.country || !profile.can_help_with);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Welcome to TRN HQ"}
        </h2>
        <p className="font-body text-sm text-muted-foreground">Your private global real estate network. Connect, refer, close.</p>
      </motion.div>

      {/* Profile completion nudge */}
      {isProfileIncomplete && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Link to="/dashboard/profile" className="block bg-gold/5 border border-gold/20 rounded-xl p-4 hover:bg-gold/10 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-gold">Complete your profile</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">Members with complete profiles get 3x more introductions</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gold" />
            </div>
          </Link>
        </motion.div>
      )}

      {/* Network Pulse */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Members", value: stats.members, icon: Users, link: "/dashboard/directory" },
          { label: "Markets", value: stats.countries, icon: Globe, link: "/dashboard/map" },
          { label: "Active Opps", value: stats.opportunities, icon: TrendingUp, link: "/dashboard/opportunities" },
          { label: "Introductions", value: stats.introductions, icon: ArrowLeftRight, link: "/dashboard/introductions" },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Link to={card.link} className="block bg-card border border-border rounded-xl p-5 hover:border-gold/20 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <card.icon className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                <ArrowUpRight className="w-3 h-3 text-muted-foreground/0 group-hover:text-gold/60 transition-all" />
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{card.value}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
        <Link to="/dashboard/directory">
          <Button variant="outline" size="sm" className="border-border text-foreground hover:border-gold/30 hover:text-gold font-body text-xs">
            <Users className="w-3.5 h-3.5 mr-1.5" /> Find a Partner
          </Button>
        </Link>
        <Link to="/dashboard/opportunities">
          <Button variant="outline" size="sm" className="border-border text-foreground hover:border-gold/30 hover:text-gold font-body text-xs">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Post an Opportunity
          </Button>
        </Link>
        <Link to="/dashboard/partners">
          <Button variant="outline" size="sm" className="border-border text-foreground hover:border-gold/30 hover:text-gold font-body text-xs">
            <Briefcase className="w-3.5 h-3.5 mr-1.5" /> View Partners
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Opportunities */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base font-semibold text-foreground">Live Opportunities</h3>
            <Link to="/dashboard/opportunities" className="font-body text-[11px] text-gold hover:text-gold-light transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentOpportunities.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground py-4 text-center">No active opportunities yet</p>
            ) : recentOpportunities.map((o) => (
              <div key={o.id} className="p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-body text-sm font-medium text-foreground">{o.title}</h4>
                  <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[10px] shrink-0">{o.opportunity_type}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1.5 font-body text-[11px] text-muted-foreground">
                  {(o.market_city || o.market_country) && (
                    <span>{[o.market_city, o.market_country].filter(Boolean).join(", ")}</span>
                  )}
                  <span>by {profiles[o.posted_by] || "Member"}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base font-semibold text-foreground">Upcoming Events</h3>
            <Link to="/dashboard/events" className="font-body text-[11px] text-gold hover:text-gold-light transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground py-4 text-center">No upcoming events</p>
            ) : upcomingEvents.map((e) => (
              <div key={e.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-gold/10 flex flex-col items-center justify-center shrink-0">
                  <span className="font-display text-sm font-bold text-gold leading-none">{format(new Date(e.event_date), "d")}</span>
                  <span className="font-body text-[8px] text-gold/60 uppercase">{format(new Date(e.event_date), "MMM")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body text-sm font-medium text-foreground truncate">{e.title}</h4>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                    {e.event_type}{e.speaker ? ` · ${e.speaker}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* New Members */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base font-semibold text-foreground">Recently Joined</h3>
            <Link to="/dashboard/directory" className="font-body text-[11px] text-gold hover:text-gold-light transition-colors">Full directory →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {recentMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="font-display text-xs font-bold text-gold">{(m.full_name || "?")[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">{m.full_name || "New Member"}</p>
                  <p className="font-body text-[10px] text-muted-foreground truncate">
                    {[m.city, m.country].filter(Boolean).join(", ") || "—"}
                  </p>
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
