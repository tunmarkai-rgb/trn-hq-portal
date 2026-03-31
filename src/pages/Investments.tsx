import { useEffect, useState } from "react";
import { Plus, MapPin, User, Search, DollarSign, TrendingUp, Handshake } from "lucide-react";
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

const investmentTypes = [
  "Off-Market Listing", "Development Opportunity", "Distressed Property",
  "Rental / Yield Play", "Land Opportunity", "Commercial", "Luxury Residential",
  "Buyer Requirement", "JV / Partnership"
];

const categories = [
  "Investment", "Off-Market", "Development", "Distressed", "Rental",
  "Land", "Commercial", "Luxury", "Buyer Need"
];

const typeColors: Record<string, string> = {
  "Off-Market Listing": "bg-gold/10 text-gold border-gold/20",
  "Development Opportunity": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Distressed Property": "bg-red-500/10 text-red-400 border-red-500/20",
  "Rental / Yield Play": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Land Opportunity": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Commercial": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Luxury Residential": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Buyer Requirement": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "JV / Partnership": "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const Investments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [collabOpen, setCollabOpen] = useState(false);
  const [collabListing, setCollabListing] = useState<any>(null);
  const [collabForm, setCollabForm] = useState({ reason: "", what_they_bring: "", market_relevance: "" });
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    title: "", investment_type: "Off-Market Listing", category: "Investment",
    description: "", summary: "", country: "", city: "",
    asking_price: "", roi_potential: "",
  });

  const fetchData = async () => {
    const [listingsRes, profilesRes] = await Promise.all([
      (supabase.from("investment_listings" as any).select("*") as any).eq("deal_status", "Active").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, full_name"),
    ]);
    setListings(listingsRes.data || []);
    const map: Record<string, string> = {};
    (profilesRes.data || []).forEach((p: any) => { map[p.user_id] = p.full_name || "Member"; });
    setProfiles(map);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("investment_listings").insert({
      title: form.title,
      investment_type: form.investment_type,
      category: form.category,
      description: form.description || null,
      summary: form.summary || null,
      country: form.country || null,
      city: form.city || null,
      asking_price: form.asking_price || null,
      roi_potential: form.roi_potential || null,
      posted_by: user.id,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Investment posted" });
      setOpen(false);
      setForm({ title: "", investment_type: "Off-Market Listing", category: "Investment", description: "", summary: "", country: "", city: "", asking_price: "", roi_potential: "" });
      fetchData();
    }
  };

  const handleCollab = async () => {
    if (!user || !collabListing) return;
    setSending(true);
    const { error } = await supabase.from("collaboration_requests").insert({
      requester_id: user.id,
      listing_id: collabListing.id,
      reason: collabForm.reason,
      what_they_bring: collabForm.what_they_bring || null,
      market_relevance: collabForm.market_relevance || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Collaboration request sent", description: "The listing owner and admin will review your request." });
      setCollabOpen(false);
      setCollabListing(null);
      setCollabForm({ reason: "", what_they_bring: "", market_relevance: "" });
    }
    setSending(false);
  };

  const filtered = listings.filter((l) => {
    const matchesType = typeFilter === "all" || l.investment_type === typeFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q) || l.country?.toLowerCase().includes(q) || l.city?.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Investment Board</h2>
          <p className="font-body text-sm text-muted-foreground">Curated opportunities from the network. Post, collaborate, close.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
              <Plus className="w-4 h-4 mr-1" /> Post Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">Post an Investment Opportunity</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="font-body text-xs text-muted-foreground">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-background border-border text-foreground font-body" placeholder="e.g. Off-market villa portfolio — Costa del Sol" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Investment Type</Label>
                  <Select value={form.investment_type} onValueChange={(v) => setForm({ ...form, investment_type: v })}>
                    <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {investmentTypes.map((t) => <SelectItem key={t} value={t} className="font-body">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories.map((c) => <SelectItem key={c} value={c} className="font-body">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Summary</Label>
                <Input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="One-liner about this opportunity" />
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Full Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[100px]" placeholder="Details about the investment, market context, potential returns..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
                <div><Label className="font-body text-xs text-muted-foreground">City / Area</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">Asking Price / Range</Label><Input value={form.asking_price} onChange={(e) => setForm({ ...form, asking_price: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="€500k — €1.2M" /></div>
                <div><Label className="font-body text-xs text-muted-foreground">ROI / Yield Potential</Label><Input value={form.roi_potential} onChange={(e) => setForm({ ...form, roi_potential: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="6-8% net yield" /></div>
              </div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">Post Investment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search investments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border text-foreground font-body" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTypeFilter("all")} className={`px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${typeFilter === "all" ? "bg-gold/20 text-gold" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
            All ({listings.length})
          </button>
          {investmentTypes.map((t) => {
            const count = listings.filter((l) => l.investment_type === t).length;
            if (count === 0) return null;
            return (
              <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${typeFilter === t ? "bg-gold/20 text-gold" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
                {t.replace(" Opportunity", "").replace(" Listing", "")} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-muted-foreground">Loading investments...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 font-body text-muted-foreground">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No investment opportunities yet. Be the first to post.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-card border border-border rounded-xl p-6 hover:border-gold/20 transition-all duration-300 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">{l.title}</h3>
                  {l.featured && <Badge className="bg-gold/20 text-gold border-gold/30 font-body text-[10px] mt-1">★ Featured</Badge>}
                </div>
                <Badge className={`${typeColors[l.investment_type] || "bg-secondary text-muted-foreground"} font-body text-[10px] shrink-0`}>{l.investment_type}</Badge>
              </div>

              {l.summary && <p className="font-body text-sm text-muted-foreground">{l.summary}</p>}
              {l.description && <p className="font-body text-xs text-muted-foreground line-clamp-3">{l.description}</p>}

              <div className="flex flex-wrap items-center gap-4 font-body text-[11px] text-muted-foreground">
                {(l.city || l.country) && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{[l.city, l.country].filter(Boolean).join(", ")}</span>
                )}
                {l.asking_price && (
                  <span className="flex items-center gap-1 text-gold"><DollarSign className="w-3 h-3" />{l.asking_price}</span>
                )}
                {l.roi_potential && (
                  <span className="flex items-center gap-1 text-emerald-400"><TrendingUp className="w-3 h-3" />{l.roi_potential}</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2 font-body text-[11px] text-muted-foreground">
                  <Link to={`/dashboard/member/${l.posted_by}`} className="flex items-center gap-1 hover:text-gold transition-colors">
                    <User className="w-3 h-3" />{profiles[l.posted_by] || "Member"}
                  </Link>
                  <span>·</span>
                  <span>{format(new Date(l.created_at), "MMM d")}</span>
                </div>
                {user?.id !== l.posted_by && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setCollabListing(l); setCollabOpen(true); }} className="border-gold/20 text-gold hover:bg-gold/10 font-body text-xs h-8">
                      <Handshake className="w-3 h-3 mr-1" /> Collaborate
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Collaboration Request Dialog */}
      <Dialog open={collabOpen} onOpenChange={setCollabOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader><DialogTitle className="font-display">Request Collaboration</DialogTitle></DialogHeader>
          {collabListing && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-body text-sm font-medium text-foreground">{collabListing.title}</p>
                <p className="font-body text-xs text-muted-foreground">{[collabListing.city, collabListing.country].filter(Boolean).join(", ")} · {collabListing.investment_type}</p>
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Why do you want to collaborate? *</Label>
                <Textarea value={collabForm.reason} onChange={(e) => setCollabForm({ ...collabForm, reason: e.target.value })} placeholder="I have qualified investors looking for exactly this type of asset..." className="bg-background border-border text-foreground font-body mt-1.5 min-h-[80px]" />
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">What do you bring to this deal?</Label>
                <Textarea value={collabForm.what_they_bring} onChange={(e) => setCollabForm({ ...collabForm, what_they_bring: e.target.value })} placeholder="Local market expertise, qualified buyer, co-investment capital..." className="bg-background border-border text-foreground font-body mt-1.5 min-h-[60px]" />
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Market relevance / fit</Label>
                <Input value={collabForm.market_relevance} onChange={(e) => setCollabForm({ ...collabForm, market_relevance: e.target.value })} placeholder="Active in this market with 5+ years experience" className="bg-background border-border text-foreground font-body mt-1.5" />
              </div>
              <Button onClick={handleCollab} disabled={sending || !collabForm.reason} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
                {sending ? "Sending..." : "Submit Collaboration Request"}
              </Button>
              <p className="font-body text-[10px] text-muted-foreground text-center">Requests are reviewed by the listing owner and network admin</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Investments;
