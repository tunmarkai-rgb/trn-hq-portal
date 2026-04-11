import { useEffect, useState } from "react";
import { Users, TrendingUp, ArrowUpRight, Globe, Briefcase, CheckCircle2, Circle, MapPin, Trophy, Building2, CalendarDays, Handshake, MessageCircle, X as XIcon, Megaphone, ArrowLeftRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCounter from "@/components/AnimatedCounter";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ members: 0, countries: 0, opportunities: 0, dealsInProgress: 0, investments: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentOpps, setRecentOpps] = useState<any[]>([]);
  const [featuredInvestments, setFeaturedInvestments] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [featuredWin, setFeaturedWin] = useState<any>(null);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("trn_dismissed_announcements") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      const [profileRes, membersRes, oppsRes, eventsRes, dealsRes, introsRes, profilesRes, winsRes, recentMembersRes, investmentsRes, announcementsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("profiles").select("country").eq("approval_status", "approved"),
        supabase.from("referral_opportunities").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(4),
        supabase.from("events").select("*").gte("event_date", new Date().toISOString()).order("event_date").limit(3),
        supabase.from("deals").select("id", { count: "exact", head: true }).not("stage", "in", '("Closed Won","Closed Lost")'),
        supabase.from("introductions").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("profiles").select("user_id, full_name"),
        supabase.from("network_updates").select("*").eq("type", "win").eq("published", true).order("created_at", { ascending: false }).limit(1),
        supabase.from("profiles").select("full_name, city, country, role, created_at").eq("approval_status", "approved").order("created_at", { ascending: false }).limit(4),
        (supabase.from("investment_listings" as any).select("*") as any).eq("deal_status", "Active").order("created_at", { ascending: false }).limit(4),
        supabase.from("announcements").select("*").eq("pinned", true).order("created_at", { ascending: false }),
      ]);

      setProfile(profileRes.data);
      const allMembers = membersRes.data || [];
      const uniqueCountries = new Set(allMembers.map((m: any) => m.country).filter(Boolean));
      const profileMap: Record<string, string> = {};
      (profilesRes.data || []).forEach((p: any) => { profileMap[p.user_id] = p.full_name || "Member"; });
      setProfiles(profileMap);

      const investmentData = investmentsRes.data || [];
      setStats({
        members: allMembers.length,
        countries: uniqueCountries.size,
        opportunities: (oppsRes.data || []).length,
        dealsInProgress: dealsRes.count || 0,
        investments: investmentData.length,
      });
      setStatsLoaded(true);
      setUpcomingEvents(eventsRes.data || []);
      setRecentOpps(oppsRes.data || []);
      setFeaturedInvestments(
        investmentData.filter((i: any) => i.featured).slice(0, 3).length > 0
          ? investmentData.filter((i: any) => i.featured).slice(0, 3)
          : investmentData.slice(0, 3)
      );
      setFeaturedWin(winsRes.data?.[0] || null);
      setAnnouncements(announcementsRes.data || []);

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

  const completedFields = profile
    ? [profile.full_name, profile.city, profile.country, profile.agency, profile.can_help_with, profile.looking_for, profile.niche?.length > 0 ? "yes" : null, profile.bio].filter(Boolean).length
    : 0;
  const totalFields = 8;
  const isProfileIncomplete = completedFields < totalFields;

  const dismissAnnouncement = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    localStorage.setItem("trn_dismissed_announcements", JSON.stringify(updated));
  };

  const visibleAnnouncements = announcements.filter((a) => !dismissedIds.includes(a.id));

  const nextActions = [
    isProfileIncomplete
      ? { label: "Complete your profile", link: "/dashboard/profile", done: false }
      : { label: "Profile complete", link: "/dashboard/profile", done: true },
    { label: "Browse investment board", link: "/dashboard/investments", done: false },
    { label: "Post an opportunity", link: "/dashboard/opportunities", done: false },
    { label: "Request an introduction", link: "/dashboard/directory", done: false },
  ];

  const statCards = [
    { label: "Members", value: stats.members, icon: Users, link: "/dashboard/directory" },
    { label: "Markets", value: stats.countries, icon: Globe, link: "/dashboard/map" },
    { label: "Opportunities", value: stats.opportunities, icon: TrendingUp, link: "/dashboard/opportunities" },
    { label: "Investments", value: stats.investments, icon: Building2, link: "/dashboard/investments" },
    { label: "Active Deals", value: stats.dealsInProgress, icon: Briefcase, link: "/dashboard/deals" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Welcome to TRN HQ"}
        </h2>
        <p className="font-body text-sm text-muted-foreground">Your global real estate headquarters</p>
      </motion.div>

      {/* Pinned Announcements */}
      {visibleAnnouncements.length > 0 && (
        <div className="space-y-2">
          {visibleAnnouncements.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-gold/5 border border-gold/25 rounded-xl px-4 py-3"
            >
              <Megaphone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-gold">{a.title}</p>
                {a.body && <p className="font-body text-xs text-muted-foreground mt-0.5 leading-relaxed">{a.body}</p>}
              </div>
              <button
                onClick={() => dismissAnnouncement(a.id)}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Network Stats — glassmorphism cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ y: -2 }}
          >
            <Link
              to={card.link}
              className="block bg-card/60 backdrop-blur-sm border border-gold/10 hover:border-gold/30 hover:shadow-[0_4px_24px_hsl(var(--gold)/0.08)] rounded-xl overflow-hidden transition-all duration-200 group"
            >
              {/* Gold top border gradient */}
              <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold/20 to-transparent" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <card.icon className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                  <ArrowUpRight className="w-3 h-3 text-transparent group-hover:text-gold/60 transition-all" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {statsLoaded ? (
                    <AnimatedCounter to={card.value} duration={1000} />
                  ) : (
                    "—"
                  )}
                </p>
                <p className="font-body text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Investments */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <SectionHeading title="Investment Board" />
            <Link to="/dashboard/investments" className="font-body text-[11px] text-gold hover:text-gold-light transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {featuredInvestments.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto">
                  <Building2 className="w-5 h-5 text-gold/30" />
                </div>
                <p className="font-body text-sm text-muted-foreground">No investments yet</p>
                <p className="font-body text-xs text-muted-foreground/60">Be the first to post on the investment board</p>
              </div>
            ) : featuredInvestments.map((l) => (
              <Link key={l.id} to="/dashboard/investments" className="block p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-body text-sm font-medium text-foreground truncate">{l.title}</h4>
                    <div className="flex items-center gap-3 mt-1 font-body text-[11px] text-muted-foreground">
                      {(l.city || l.country) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{[l.city, l.country].filter(Boolean).join(", ")}
                        </span>
                      )}
                      {l.asking_price && <span className="text-gold">{l.asking_price}</span>}
                      <span>by {profiles[l.posted_by] || "Member"}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[10px] shrink-0">
                    {l.investment_type}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <SectionHeading title="Upcoming Calls" className="mb-4" />
            {upcomingEvents.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto">
                  <CalendarDays className="w-4 h-4 text-gold/30" />
                </div>
                <p className="font-body text-sm text-muted-foreground">No calls scheduled</p>
              </div>
            ) : upcomingEvents.map((e) => (
              <div key={e.id} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex flex-col items-center justify-center shrink-0">
                  <span className="font-display text-sm font-bold text-gold leading-none">
                    {e.event_date ? format(new Date(e.event_date), "d") : "?"}
                  </span>
                  <span className="font-body text-[7px] text-gold/60 uppercase">
                    {e.event_date ? format(new Date(e.event_date), "MMM") : ""}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-body text-xs font-medium text-foreground truncate">{e.title}</h4>
                  <p className="font-body text-[10px] text-muted-foreground">
                    {e.event_date ? format(new Date(e.event_date), "h:mm a") : ""}
                    {e.speaker ? ` · ${e.speaker}` : ""}
                  </p>
                </div>
              </div>
            ))}
            <Link to="/dashboard/events" className="block mt-3 font-body text-[11px] text-gold hover:text-gold-light transition-colors text-center">
              View all events →
            </Link>
          </motion.div>

          {/* Next Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <SectionHeading title="Next Actions" className="mb-4" />
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
        </div>
      </div>

      {/* Bottom: Activity + Deal Flow + Win */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <SectionHeading title="Network Activity" className="mb-4" />
          {recentActivity.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto">
                <ArrowLeftRight className="w-4 h-4 text-gold/30" />
              </div>
              <p className="font-body text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.type === "new_member" ? "bg-emerald-400" : a.type === "intro_approved" ? "bg-gold" : "bg-muted-foreground"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm text-foreground">{a.text}</p>
                    <p className="font-body text-[10px] text-muted-foreground mt-0.5">
                      {a.date ? format(new Date(a.date), "MMM d") : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Deal Flow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <SectionHeading title="Deal Flow" />
            <Link to="/dashboard/opportunities" className="font-body text-[11px] text-gold hover:text-gold-light transition-colors">
              View all →
            </Link>
          </div>
          {recentOpps.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto">
                <TrendingUp className="w-4 h-4 text-gold/30" />
              </div>
              <p className="font-body text-sm text-muted-foreground">No opportunities yet</p>
            </div>
          ) : recentOpps.map((o) => (
            <Link key={o.id} to="/dashboard/opportunities" className="block p-2 rounded-lg hover:bg-secondary/30 transition-colors mb-1">
              <h4 className="font-body text-xs font-medium text-foreground truncate">{o.title}</h4>
              <p className="font-body text-[10px] text-muted-foreground">
                {o.opportunity_type} · {[o.market_city, o.market_country].filter(Boolean).join(", ")}
              </p>
            </Link>
          ))}
        </motion.div>

        {/* Featured Win */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <SectionHeading title="Network Highlight" className="mb-4" />
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
            <div className="py-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto">
                <Trophy className="w-4 h-4 text-gold/30" />
              </div>
              <p className="font-body text-sm text-muted-foreground">Wins will be featured here</p>
              <p className="font-body text-xs text-muted-foreground/60">Admin can post network highlights</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* WhatsApp Community */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
        <a
          href="https://chat.whatsapp.com/I0ujof3J8Xe15md9XThwfV"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 hover:bg-emerald-500/10 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-body text-sm font-medium text-emerald-400">Members WhatsApp Group</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Join your fellow TRN members in the private WhatsApp group</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-emerald-400/50 group-hover:text-emerald-400 transition-colors shrink-0" />
        </a>
      </motion.div>

      {/* Profile nudge */}
      {isProfileIncomplete && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Link
            to="/dashboard/profile"
            className="block bg-gold/5 border border-gold/20 rounded-xl p-4 hover:bg-gold/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-gold">
                  Complete your profile — {Math.round((completedFields / totalFields) * 100)}% done
                </p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">Complete profiles get 3x more introductions</p>
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
