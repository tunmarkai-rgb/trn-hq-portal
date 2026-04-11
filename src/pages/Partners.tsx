import { useEffect, useState } from "react";
import { Briefcase, ExternalLink, ArrowLeftRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const categoryColors: Record<string, string> = {
  "FX / Currency": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Tax: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Relocation: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Legal: "bg-gold/10 text-gold border-gold/20",
  "Lenders / Finance": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Developers: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Residency / Visa": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Corporate Structuring": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Currency Exchange": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Tax & Immigration": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Wealth Management": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Franchise Partner": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Market Data": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const Partners = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [introOpen, setIntroOpen] = useState(false);
  const [introPartner, setIntroPartner] = useState<any>(null);
  const [introMessage, setIntroMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("partners").select("*").order("category");
      setPartners(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = [...new Set(partners.map((p) => p.category))];

  const filtered = partners.filter((p) => {
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleRequestIntro = async () => {
    if (!user || !introPartner) return;
    setSending(true);
    // Use introductions table with target_type = 'partner'
    const { error } = await supabase.from("introductions").insert({
      requester_id: user.id,
      target_id: user.id, // self-ref since partner doesn't have user_id
      target_type: "partner",
      reason: `Partner intro request: ${introPartner.name}`,
      message: introMessage || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Introduction requested", description: `Your request to connect with ${introPartner.name} has been sent to the network admin.` });
      setIntroOpen(false);
      setIntroPartner(null);
      setIntroMessage("");
    }
    setSending(false);
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-32 bg-secondary/40 rounded-md animate-pulse" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 bg-secondary/30 rounded-xl animate-pulse" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Vetted Partners</h2>
        <p className="font-body text-sm text-muted-foreground">Trusted service providers for international real estate professionals</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] bg-card border-border text-foreground font-body">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="font-body">All Categories</SelectItem>
            {categories.sort().map((c) => <SelectItem key={c} value={c} className="font-body">{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search partners..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border text-foreground font-body" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 font-body text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No partners found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-gold/20 transition-all duration-300 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{p.name}</h3>
                  <Badge className={`${categoryColors[p.category] || "bg-secondary text-muted-foreground"} font-body text-[10px] mt-1`}>
                    {p.category}
                  </Badge>
                </div>
              </div>

              {p.description && <p className="font-body text-sm text-muted-foreground">{p.description}</p>}

              {p.who_they_help && (
                <p className="font-body text-[11px] text-muted-foreground">
                  <span className="text-gold/60">Who they help:</span> {p.who_they_help}
                </p>
              )}

              {p.markets_served?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.markets_served.map((m: string) => (
                    <Badge key={m} variant="secondary" className="bg-secondary text-muted-foreground font-body text-[10px]">{m}</Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                {p.website && (
                  <a href={p.website} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="border-border text-muted-foreground hover:text-foreground font-body text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" /> Website
                    </Button>
                  </a>
                )}
                <Button size="sm" variant="outline" onClick={() => { setIntroPartner(p); setIntroOpen(true); }} className="border-gold/20 text-gold hover:bg-gold/10 font-body text-xs">
                  <ArrowLeftRight className="w-3 h-3 mr-1" /> Request Intro
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Partner detail dialog */}
      <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader><DialogTitle className="font-display">{selectedPartner?.name}</DialogTitle></DialogHeader>
          {selectedPartner && (
            <div className="space-y-4">
              <Badge className={`${categoryColors[selectedPartner.category] || ""} font-body text-[10px]`}>{selectedPartner.category}</Badge>
              {selectedPartner.description && <p className="font-body text-sm text-muted-foreground">{selectedPartner.description}</p>}
              {selectedPartner.use_cases && <div><h4 className="font-body text-xs text-gold/60 mb-1">Typical use cases</h4><p className="font-body text-sm text-foreground">{selectedPartner.use_cases}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Intro request dialog */}
      <Dialog open={introOpen} onOpenChange={setIntroOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader><DialogTitle className="font-display">Request Introduction</DialogTitle></DialogHeader>
          {introPartner && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-body text-sm font-medium text-foreground">{introPartner.name}</p>
                <p className="font-body text-xs text-muted-foreground">{introPartner.category}</p>
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Why do you need this introduction? (optional)</Label>
                <Textarea value={introMessage} onChange={(e) => setIntroMessage(e.target.value)} placeholder="I need FX support for a cross-border deal..." className="bg-background border-border text-foreground font-body mt-1.5 min-h-[80px]" />
              </div>
              <Button onClick={handleRequestIntro} disabled={sending} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
                {sending ? "Sending..." : "Send Introduction Request"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Partners;
