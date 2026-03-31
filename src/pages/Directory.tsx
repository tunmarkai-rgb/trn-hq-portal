import { useEffect, useState } from "react";
import { Search, MapPin, Globe, Filter, ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  city: string | null;
  country: string | null;
  agency: string | null;
  niche: string[] | null;
  languages: string[] | null;
  role: string | null;
  can_help_with: string | null;
  looking_for: string | null;
}

const Directory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [introTarget, setIntroTarget] = useState<Profile | null>(null);
  const [introMessage, setIntroMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("profiles").select("*").order("full_name");
      setProfiles(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const countries = [...new Set(profiles.map((p) => p.country).filter(Boolean))] as string[];

  const filtered = profiles.filter((p) => {
    if (p.user_id === user?.id) return false; // Don't show self
    const q = search.toLowerCase();
    const matchesSearch =
      (p.full_name || "").toLowerCase().includes(q) ||
      (p.city || "").toLowerCase().includes(q) ||
      (p.country || "").toLowerCase().includes(q) ||
      (p.agency || "").toLowerCase().includes(q) ||
      (p.niche || []).some((n) => n.toLowerCase().includes(q)) ||
      (p.can_help_with || "").toLowerCase().includes(q);
    const matchesCountry = countryFilter === "all" || p.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const handleRequestIntro = async () => {
    if (!user || !introTarget) return;
    setSending(true);
    const { error } = await supabase.from("introductions").insert({
      requester_id: user.id,
      target_id: introTarget.user_id,
      message: introMessage || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Introduction requested", description: `Your request to connect with ${introTarget.full_name} has been sent.` });
      setIntroTarget(null);
      setIntroMessage("");
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Member Directory</h2>
          <p className="font-body text-sm text-muted-foreground">{profiles.length} professionals across {countries.length} markets</p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[160px] bg-card border-border text-foreground font-body">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="All Markets" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="font-body">All Markets</SelectItem>
              {countries.sort().map((c) => (
                <SelectItem key={c} value={c} className="font-body">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, market, specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border text-foreground font-body"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-muted-foreground">Loading directory...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 font-body text-muted-foreground">No members found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-card border border-border rounded-xl p-5 space-y-3 hover:border-gold/20 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="font-display text-base font-bold text-gold">{(p.full_name || "?")[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-semibold text-foreground truncate">{p.full_name || "Member"}</h3>
                  {p.role && <p className="font-body text-xs text-gold/80">{p.role}</p>}
                  {(p.city || p.country) && (
                    <p className="flex items-center gap-1 font-body text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {[p.city, p.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {p.agency && (
                <p className="font-body text-xs text-muted-foreground">
                  <Globe className="w-3 h-3 inline mr-1" />{p.agency}
                </p>
              )}

              {p.niche && p.niche.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.niche.slice(0, 3).map((n) => (
                    <Badge key={n} variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[10px]">{n}</Badge>
                  ))}
                  {p.niche.length > 3 && <Badge variant="secondary" className="bg-secondary text-muted-foreground font-body text-[10px]">+{p.niche.length - 3}</Badge>}
                </div>
              )}

              {p.can_help_with && (
                <p className="font-body text-[11px] text-muted-foreground line-clamp-2">
                  <span className="text-gold/60">Can help with:</span> {p.can_help_with}
                </p>
              )}

              <div className="pt-2 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIntroTarget(p)}
                  className="w-full border-gold/20 text-gold hover:bg-gold/10 font-body text-xs"
                >
                  <ArrowLeftRight className="w-3 h-3 mr-1.5" /> Request Introduction
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Introduction Request Dialog */}
      <Dialog open={!!introTarget} onOpenChange={(open) => !open && setIntroTarget(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display">Request Introduction</DialogTitle>
          </DialogHeader>
          {introTarget && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-gold">{(introTarget.full_name || "?")[0]}</span>
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{introTarget.full_name}</p>
                  <p className="font-body text-xs text-muted-foreground">{[introTarget.city, introTarget.country].filter(Boolean).join(", ")}</p>
                </div>
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Why do you want to connect? (optional)</Label>
                <Textarea
                  value={introMessage}
                  onChange={(e) => setIntroMessage(e.target.value)}
                  placeholder="I have a client looking to invest in your market..."
                  className="bg-background border-border text-foreground font-body mt-1.5 min-h-[80px]"
                />
              </div>
              <Button onClick={handleRequestIntro} disabled={sending} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
                {sending ? "Sending..." : "Send Introduction Request"}
              </Button>
              <p className="font-body text-[10px] text-muted-foreground text-center">This keeps connections intentional and high quality</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Directory;
