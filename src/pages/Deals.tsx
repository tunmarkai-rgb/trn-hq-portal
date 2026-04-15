import { useEffect, useState } from "react";
import { Plus, Building2 } from "lucide-react";
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

const stages = ["New", "Intro Requested", "Intro Made", "In Discussion", "Negotiating", "Under Offer", "In Progress", "Closed Won", "Closed Lost"];

const stageColors: Record<string, string> = {
  New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Intro Requested": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "Intro Made": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "In Discussion": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Negotiating: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Under Offer": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "In Progress": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Closed Won": "bg-gold/10 text-gold border-gold/20",
  "Closed Lost": "bg-red-500/10 text-red-400 border-red-500/20",
};

const Deals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deals, setDeals] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState("all");
  const [editingDeal, setEditingDeal] = useState<any>(null);
  const [form, setForm] = useState({ title: "", city: "", country: "", estimated_value: "", summary: "", stage: "New", deal_type: "Sale" });

  const fetchDeals = async () => {
    if (!user) return;
    const [dealsRes, profilesRes] = await Promise.all([
      supabase.from("deals").select("*").order("updated_at", { ascending: false }),
      supabase.from("profiles").select("user_id, full_name"),
    ]);
    setDeals(dealsRes.data || []);
    const map: Record<string, string> = {};
    (profilesRes.data || []).forEach((p: any) => { map[p.user_id] = p.full_name || "Member"; });
    setProfiles(map);
    setLoading(false);
  };

  useEffect(() => { fetchDeals(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("deals").insert({
      title: form.title,
      city: form.city || null,
      country: form.country || null,
      estimated_value: form.estimated_value ? Number(form.estimated_value) : null,
      summary: form.summary || null,
      stage: form.stage,
      deal_type: form.deal_type,
      created_by: user.id,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deal created" });
      setOpen(false);
      setForm({ title: "", city: "", country: "", estimated_value: "", summary: "", stage: "New", deal_type: "Sale" });
      fetchDeals();
    }
  };

  const handleStageUpdate = async (dealId: string, newStage: string) => {
    const { error } = await supabase.from("deals").update({ stage: newStage }).eq("id", dealId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Stage updated to ${newStage}` });
      fetchDeals();
    }
  };

  const filtered = stageFilter === "all" ? deals : deals.filter((d) => d.stage === stageFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">My Deals</h2>
          <p className="font-body text-sm text-muted-foreground">Track live deals through your pipeline</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
              <Plus className="w-4 h-4 mr-1" /> New Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground w-[calc(100vw-2rem)] sm:w-auto max-w-lg">
            <DialogHeader><DialogTitle className="font-display">New Deal</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><Label className="font-body text-xs text-muted-foreground">Deal Name *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-background border-border text-foreground font-body" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
                <div><Label className="font-body text-xs text-muted-foreground">Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Deal Type</Label>
                  <Select value={form.deal_type} onValueChange={(v) => setForm({ ...form, deal_type: v })}>
                    <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {["Sale", "Purchase", "Referral", "Investment", "Development"].map(t => <SelectItem key={t} value={t} className="font-body">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Stage</Label>
                  <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                    <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {stages.map(s => <SelectItem key={s} value={s} className="font-body">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label className="font-body text-xs text-muted-foreground">Estimated Value</Label><Input type="number" value={form.estimated_value} onChange={(e) => setForm({ ...form, estimated_value: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Summary</Label><Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[60px]" /></div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">Create Deal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stage filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setStageFilter("all")} className={`px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${stageFilter === "all" ? "bg-gold/20 text-gold" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
          All ({deals.length})
        </button>
        {stages.map((s) => {
          const count = deals.filter((d) => d.stage === s).length;
          if (count === 0) return null;
          return (
            <button key={s} onClick={() => setStageFilter(s)} className={`px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${stageFilter === s ? "bg-gold/20 text-gold" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-secondary/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 font-body text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No deals yet. Create your first deal to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-semibold text-foreground">{d.title}</h3>
                  <p className="font-body text-[11px] text-muted-foreground mt-1">
                    {d.deal_type || "Sale"} · {[d.city, d.country].filter(Boolean).join(", ")}
                    {d.estimated_value ? ` · $${Number(d.estimated_value).toLocaleString()}` : ""}
                  </p>
                </div>
                <Badge className={`${stageColors[d.stage] || stageColors.New} font-body text-[10px] shrink-0`}>{d.stage || "New"}</Badge>
              </div>
              {d.summary && <p className="font-body text-sm text-muted-foreground">{d.summary}</p>}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-body text-[10px] text-muted-foreground">Updated {d.updated_at ? format(new Date(d.updated_at), "MMM d, yyyy") : ""}</span>
                <Select value={d.stage || "New"} onValueChange={(v) => handleStageUpdate(d.id, v)}>
                  <SelectTrigger className="w-[160px] h-8 bg-background border-border text-foreground font-body text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {stages.map(s => <SelectItem key={s} value={s} className="font-body text-xs">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Deals;
