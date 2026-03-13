import { useEffect, useState } from "react";
import { Handshake, Building2, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ deals: 0, referrals: 0, activeDeals: 0, profile: null as any });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [dealsRes, referralsRes, activeRes, profileRes] = await Promise.all([
        supabase.from("deals").select("id", { count: "exact", head: true }).or(`created_by.eq.${user.id},partner_id.eq.${user.id}`),
        supabase.from("referrals").select("id", { count: "exact", head: true }).or(`sent_by.eq.${user.id},sent_to.eq.${user.id}`),
        supabase.from("deals").select("id", { count: "exact", head: true }).eq("status", "Active").or(`created_by.eq.${user.id},partner_id.eq.${user.id}`),
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      ]);
      setStats({
        deals: dealsRes.count || 0,
        referrals: referralsRes.count || 0,
        activeDeals: activeRes.count || 0,
        profile: profileRes.data,
      });
    };
    fetchStats();
  }, [user]);

  const cards = [
    { icon: Building2, label: "Total Deals", value: stats.deals, accent: "from-blue-500/20 to-blue-600/5" },
    { icon: TrendingUp, label: "Active Deals", value: stats.activeDeals, accent: "from-emerald-500/20 to-emerald-600/5" },
    { icon: Handshake, label: "Referrals", value: stats.referrals, accent: "from-gold/20 to-gold/5" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-[hsl(220,15%,92%)]">
          Welcome back{stats.profile?.full_name ? `, ${stats.profile.full_name}` : ""}
        </h2>
        <p className="font-body text-[hsl(220,10%,50%)] mt-1">Here's your network overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[hsl(220,25%,9%)] border border-gold/8 rounded-2xl p-6 hover:border-gold/15 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-body text-xs text-[hsl(220,10%,50%)] uppercase tracking-wider">{card.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-gold" />
              </div>
            </div>
            <p className="font-display text-4xl font-bold text-[hsl(220,15%,92%)]">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[hsl(220,25%,9%)] border border-gold/8 rounded-2xl p-8"
      >
        <h3 className="font-display text-lg font-semibold text-[hsl(220,15%,88%)] mb-5">Getting Started</h3>
        <ul className="space-y-4 font-body text-sm text-[hsl(220,10%,55%)]">
          {[
            { icon: Users, text: "Browse the Directory to find agents in your target markets", label: "Directory" },
            { icon: Handshake, text: "Send a Referral when you have a client for another market", label: "Referrals" },
            { icon: Building2, text: "Track your Deals privately with your partners", label: "Deals" },
          ].map((item) => (
            <li key={item.label} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[hsl(220,25%,11%)] transition-colors group cursor-default">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                <item.icon className="w-4 h-4 text-gold" />
              </div>
              <span className="flex-1">{item.text}</span>
              <ArrowUpRight className="w-4 h-4 text-gold/0 group-hover:text-gold/50 transition-all shrink-0 mt-1" />
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Dashboard;
