import { useEffect, useState } from "react";
import { Handshake, Building2, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
    { icon: Building2, label: "Total Deals", value: stats.deals, color: "text-blue-400" },
    { icon: TrendingUp, label: "Active Deals", value: stats.activeDeals, color: "text-green-400" },
    { icon: Handshake, label: "Referrals", value: stats.referrals, color: "text-gold" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-[hsl(220,15%,90%)]">
          Welcome back{stats.profile?.full_name ? `, ${stats.profile.full_name}` : ""}
        </h2>
        <p className="font-body text-[hsl(220,10%,50%)] mt-1">Here's your network overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-sm text-[hsl(220,10%,50%)]">{card.label}</span>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="font-display text-3xl font-bold text-[hsl(220,15%,90%)]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-[hsl(220,15%,85%)] mb-3">Getting Started</h3>
        <ul className="space-y-3 font-body text-sm text-[hsl(220,10%,55%)]">
          <li className="flex items-start gap-2">
            <Users className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <span>Browse the <strong className="text-[hsl(220,15%,75%)]">Directory</strong> to find agents in your target markets</span>
          </li>
          <li className="flex items-start gap-2">
            <Handshake className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <span>Send a <strong className="text-[hsl(220,15%,75%)]">Referral</strong> when you have a client for another market</span>
          </li>
          <li className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <span>Track your <strong className="text-[hsl(220,15%,75%)]">Deals</strong> privately with your partners</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
