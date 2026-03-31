import { useEffect, useState } from "react";
import { Plus, TrendingUp, MapPin, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const typeColors: Record<string, string> = {
  "Buyer Requirement": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Seller Requirement": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Investor Requirement": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Off Market Deal": "bg-gold/10 text-gold border-gold/20",
  "Development Opportunity": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Cross Border Referral Need": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Partner Service Need": "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const opportunityTypes = [
  "Buyer Requirement", "Seller Requirement", "Investor Requirement",
  "Off Market Deal", "Development Opportunity", "Cross Border Referral Need", "Partner Service Need"
];

const Opportunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "", opportunity_type: "Buyer Requirement", description: "",
    market_country: "", market_city: "", ideal_counterpart: "", budget_range: "", urgency: "normal"
  });

  const fetchData = async () => {
    const [oppsRes, profilesRes] = await Promise.all([
      supabase.from("referral_opportunities").select("*").eq("status", "open").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, full_name"),
    ]);
    setOpportunities(oppsRes.data || []);
    const profileMap: Record<string, string> = {};
    (profilesRes.data || []).forEach((p: any) => { profileMap[p.user_id] = p.full_name || "Member"; });
    setProfiles(profileMap);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("referral_opportunities").insert({
      title: form.title,
      opportunity_type: form.opportunity_type,
      description: form.description || null,
      market_country: form.market_country || null,
      market_city: form.market_city || null,
      ideal_counterpart: form.ideal_counterpart || null,
      budget_range: form.budget_range || null,
      urgency: form.urgency,
      posted_by: user.id,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Opportunity posted" });
      setOpen(false);
      setForm({ title: "", opportunity_type: "Buyer Requirement", description: "", market_country: "", market_city: "", ideal_counterpart: "", budget_range: "", urgency: "normal" });
      fetchData();
    }
  };

  const filtered = opportunities.filter((o) => {
    const matchesType = typeFilter === "all" || o.opportunity_type === typeFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || o.title?.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q) || o.market_country?.toLowerCase().includes(q) || o.market_city?.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Deal Flow</h2>
          <p className="font-body text-sm text-muted-foreground">Live opportunities from the network. High signal, no noise.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
              <Plus className="w-4 h-4 mr-1" /> Post Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">Post an Opportunity</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="font-body text-xs text-muted-foreground">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-background border-border text-foreground font-body" placeholder="e.g. Buyer looking for villa in Marbella" />
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Category</Label>
                <Select value={form.opportunity_type} onValueChange={(v) => setForm({ ...form, opportunity_type: v })}>
                  <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {opportunityTypes.map((t) => <SelectItem key={t} value={t} className="font-body">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[80px]" placeholder="What's the opportunity? What are you looking for?" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">Country</Label><Input value={form.market_country} onChange={(e) => setForm({ ...form, market_country: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
                <div><Label className="font-body text-xs text-muted-foreground">City</Label><Input value={form.market_city} onChange={(e) => setForm({ ...form, market_city: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Ideal counterpart</Label>
                <Input value={form.ideal_counterpart} onChange={(e) => setForm({ ...form, ideal_counterpart: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="Who should respond to this?" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">Budget / Deal Size</Label><Input value={form.budget_range} onChange={(e) => setForm({ ...form, budget_range: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="€500k-1M" /></div>
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Urgency</Label>
                  <Select value={form.urgency} onValueChange={(v) => setForm({ ...form, urgency: v })}>
                    <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="low" className="font-body">Low</SelectItem>
                      <SelectItem value="normal" className="font-body">Normal</SelectItem>
                      <SelectItem value="high" className="font-body">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">Post Opportunity</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search opportunities..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border text-foreground font-body" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTypeFilter("all")} className={`px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${typeFilter === "all" ? "bg-gold/20 text-gold" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
            All ({opportunities.length})
          </button>
          {opportunityTypes.map((t) => {
            const count = opportunities.filter((o) => o.opportunity_type === t).length;
            if (count === 0) return null;
            return (
              <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${typeFilter === t ? "bg-gold/20 text-gold" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
                {t} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-muted-foreground">Loading opportunities...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 font-body text-muted-foreground">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No opportunities found. Be the first to post.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-card border border-border rounded-xl p-5 hover:border-gold/20 transition-all duration-300 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-base font-semibold text-foreground">{o.title}</h3>
                <Badge className={`${typeColors[o.opportunity_type] || "bg-secondary text-muted-foreground"} font-body text-[10px] shrink-0`}>{o.opportunity_type}</Badge>
              </div>
              {o.description && <p className="font-body text-sm text-muted-foreground line-clamp-3">{o.description}</p>}
              {o.ideal_counterpart && (
                <p className="font-body text-[11px] text-gold/70">Looking for: {o.ideal_counterpart}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 font-body text-[11px] text-muted-foreground">
                  {(o.market_city || o.market_country) && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{[o.market_city, o.market_country].filter(Boolean).join(", ")}</span>
                  )}
                  <Link to={`/dashboard/member/${o.posted_by}`} className="flex items-center gap-1 hover:text-gold transition-colors">
                    <User className="w-3 h-3" />{profiles[o.posted_by] || "Member"}
                  </Link>
                  <span>{format(new Date(o.created_at), "MMM d")}</span>
                </div>
                {o.budget_range && <span className="font-body text-[11px] text-gold/60">{o.budget_range}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunities;
