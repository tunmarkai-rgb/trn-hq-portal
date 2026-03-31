import { useEffect, useState } from "react";
import { Users, TrendingUp, ArrowUpRight, Globe, ArrowLeftRight, Briefcase, CheckCircle2, Circle, MapPin, Trophy } from "lucide-react";
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
  const [stats, setStats] = useState({ members: 0, countries: 0, opportunities: 0, dealsInProgress: 0 });
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
  const [recentOpps, setRecentOpps] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [featuredWin, setFeaturedWin] = useState<any>(null);
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      const [profileRes, membersRes, oppsRes, eventRes, dealsRes, introsRes, profilesRes, winsRes, recentMembersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("profiles").select("country").eq("approval_status", "approved"),
        supabase.from("referral_opportunities").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(6),
        supabase.from("events").select("*").gte("event_date", new Date().toISOString()).order("event_date").limit(1),
        supabase.from("deals").select("id", { count: "exact", head: true }).not("stage", "in", '("Closed Won","Closed Lost")'),
        supabase.from("introductions").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("profiles").select("user_id, full_name"),
        supabase.from("network_updates").select("*").eq("type", "win").eq("published", true).order("created_at", { ascending: false }).limit(1),
        supabase.from("profiles").select("full_name, city, country, role, created_at").eq("approval_status", "approved").order("created_at", { ascending: false }).limit(4),
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
        dealsInProgress: dealsRes.count || 0,
      });
      setUpcomingEvent(eventRes.data?.[0] || null);
      setRecentOpps(oppsRes.data || []);
      setFeaturedWin(winsRes.data?.[0] || null);

      // Build activity feed from recent intros + members
      const activity: any[] = [];
      (introsRes.data || []).forEach((i: any) => {
        activity.push({
          type: i.status === "accepted" ? "intro_approved" : i.status === "pending" ? "intro_requested" : "intro_update",
          text: i.status === "accepted"
            ? `${profileMap[i.requester_id] || "A member"} connected with ${profileMap[i.target_id] || "a member"}`
            : `${profileMap[i.requester_id] || "A member"} requested intro to ${profileMap[i.target_id] || "a member"}`,
          date: i.created_at,
        });
      });
      (recentMembersRes.data || []).forEach((m: any) => {
        activity.push({
          type: "new_member",
          text: `${m.full_name || "New member"} joined from ${[m.city, m.country].filter(Boolean).join(", ") || "the network"}`,
          date: m.created_at,
        });
      });
      activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivity(activity.slice(0, 6));
    };
    fetchAll();
  }, [user]);

  const completedFields = profile ? [profile.full_name, profile.city, profile.country, profile.agency, profile.can_help_with, profile.looking_for, profile.niche?.length > 0 ? "yes" : null].filter(Boolean).length : 0;
  const totalFields = 7;
  const isProfileIncomplete = completedFields < totalFields;

  // Dynamic next actions
  const nextActions = [];
  if (isProfileIncomplete) nextActions.push({ label: "Complete your profile", link: "/dashboard/profile", done: false });
  else nextActions.push({ label: "Profile complete", link: "/dashboard/profile", done: true });
  if (!profile?.niche?.length) nextActions.push({ label: "Add your specialties", link: "/dashboard/profile", done: false });
  else nextActions.push({ label: "Specialties added", link: "/dashboard/profile", done: true });
  nextActions.push({ label: "Post your first opportunity", link: "/dashboard/opportunities", done: false });
  nextActions.push({ label: "Request your first introduction", link: "/dashboard/directory", done: false });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Welcome to TRN HQ"}
        </h2>
        <p className="font-body text-sm text-muted-foreground">Your global real estate headquarters</p>
      </motion.div>

      {/* Network Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Members", value: stats.members, icon: Users, link: "/dashboard/directory" },
          { label: "Markets", value: stats.countries, icon: Globe, link: "/dashboard/map" },
          { label: "Live Opportunities", value: stats.opportunities, icon: TrendingUp, link: "/dashboard/opportunities" },
          { label: "Deals in Progress", value: stats.dealsInProgress, icon: Briefcase, link: "/dashboard/deals" },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Link to={card.link} className="block bg-card border border-border rounded-xl p-5 hover:border-gold/20 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <card.icon className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                <ArrowUpRight className="w-3 h-3 text-transparent group-hover:text-gold/60 transition-all" />
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{card.value}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Opportunities — 2 col */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base font-semibold text-foreground">Active Opportunities</h3>
            <Link to="/dashboard/opportunities" className="font-body text-[11px] text-gold hover:text-gold-light transition-colors">View all →</Link>
          </div>
          <div className="space-y-2">
            {recentOpps.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground py-4 text-center">No active opportunities yet</p>
            ) : recentOpps.map((o) => (
              <Link key={o.id} to="/dashboard/opportunities" className="block p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-body text-sm font-medium text-foreground truncate">{o.title}</h4>
                    <div className="flex items-center gap-3 mt-1 font-body text-[11px] text-muted-foreground">
                      {(o.market_city || o.market_country) && (
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{[o.market_city, o.market_country].filter(Boolean).join(", ")}</span>
                      )}
                      <span>by {profiles[o.posted_by] || "Member"}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[10px] shrink-0">{o.opportunity_type}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Right column: Next Actions + Upcoming Call */}
        <div className="space-y-6">
          {/* Next Actions */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-base font-semibold text-foreground mb-4">Next Actions</h3>
            <div className="space-y-3">
              {nextActions.map((action, i) => (
                <Link key={i} to={action.link} className="flex items-center gap-3 group">
                  {action.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground group-hover:text-gold shrink-0 transition-colors" />
                  )}
                  <span className={`font-body text-sm ${action.done ? "text-muted-foreground line-through" : "text-foreground group-hover:text-gold"} transition-colors`}>
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Event */}
          {upcomingEvent && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display text-base font-semibold text-foreground mb-4">Next Event</h3>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex flex-col items-center justify-center shrink-0">
                  <span className="font-display text-sm font-bold text-gold leading-none">{format(new Date(upcomingEvent.event_date), "d")}</span>
                  <span className="font-body text-[8px] text-gold/60 uppercase">{format(new Date(upcomingEvent.event_date), "MMM")}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-body text-sm font-medium text-foreground">{upcomingEvent.title}</h4>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                    {format(new Date(upcomingEvent.event_date), "h:mm a")}
                    {upcomingEvent.speaker ? ` · ${upcomingEvent.speaker}` : ""}
                  </p>
                  {upcomingEvent.join_link && (
                    <a href={upcomingEvent.join_link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="mt-3 bg-gold hover:bg-gold-dark text-primary-foreground font-body text-xs h-8">
                        Join Event
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom row: Activity + Featured Win */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Network Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.type === "new_member" ? "bg-emerald-400" : a.type === "intro_approved" ? "bg-gold" : "bg-muted-foreground"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm text-foreground">{a.text}</p>
                    <p className="font-body text-[10px] text-muted-foreground mt-0.5">{format(new Date(a.date), "MMM d")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Featured Win */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gold" /> Network Highlight
          </h3>
          {featuredWin ? (
            <div className="space-y-3">
              <h4 className="font-display text-lg font-semibold text-gold">{featuredWin.title}</h4>
              {featuredWin.summary && <p className="font-body text-sm text-muted-foreground">{featuredWin.summary}</p>}
              {featuredWin.markets?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {featuredWin.markets.map((m: string) => (
                    <Badge key={m} variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[10px]">{m}</Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Trophy className="w-10 h-10 mx-auto mb-2 text-muted-foreground/20" />
              <p className="font-body text-sm text-muted-foreground">Network wins will be featured here</p>
              <p className="font-body text-[11px] text-muted-foreground/60 mt-1">Real deals. Real results. Real momentum.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Profile completion nudge at bottom if incomplete */}
      {isProfileIncomplete && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <Link to="/dashboard/profile" className="block bg-gold/5 border border-gold/20 rounded-xl p-4 hover:bg-gold/10 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-gold">Complete your profile — {Math.round((completedFields / totalFields) * 100)}% done</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">Members with complete profiles get 3x more introductions</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gold" />
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
