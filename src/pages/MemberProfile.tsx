import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Globe, ArrowLeftRight, ArrowLeft, Briefcase, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const MemberProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [recentOpps, setRecentOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [introOpen, setIntroOpen] = useState(false);
  const [introForm, setIntroForm] = useState({ reason: "", context: "", urgency: "normal" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      const [profileRes, oppsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase.from("referral_opportunities").select("*").eq("posted_by", userId).eq("status", "open").order("created_at", { ascending: false }).limit(5),
      ]);
      setProfile(profileRes.data);
      setRecentOpps(oppsRes.data || []);
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  const handleRequestIntro = async () => {
    if (!user || !userId) return;
    setSending(true);
    const { error } = await supabase.from("introductions").insert({
      requester_id: user.id,
      target_id: userId,
      reason: introForm.reason || null,
      context: introForm.context || null,
      urgency: introForm.urgency,
      message: introForm.reason || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Introduction requested", description: `Your request has been sent.` });
      setIntroOpen(false);
      setIntroForm({ reason: "", context: "", urgency: "normal" });
    }
    setSending(false);
  };

  if (loading) return <div className="text-center py-12 font-body text-muted-foreground">Loading profile...</div>;
  if (!profile) return <div className="text-center py-12 font-body text-muted-foreground">Member not found.</div>;

  const isSelf = user?.id === userId;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/dashboard/directory" className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-gold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
            <span className="font-display text-2xl font-bold text-gold">{(profile.full_name || "?")[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-2xl font-bold text-foreground">{profile.full_name || "Member"}</h2>
            {(profile.title || profile.role) && (
              <p className="font-body text-sm text-gold/80 mt-0.5">{[profile.title, profile.role].filter(Boolean).join(" · ")}</p>
            )}
            {(profile.city || profile.country) && (
              <p className="flex items-center gap-1.5 font-body text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {[profile.city, profile.country].filter(Boolean).join(", ")}
              </p>
            )}
            {profile.agency && (
              <p className="flex items-center gap-1.5 font-body text-sm text-muted-foreground mt-0.5">
                <Globe className="w-3.5 h-3.5" />
                {profile.agency}
              </p>
            )}
          </div>
          {!isSelf && (
            <Button onClick={() => setIntroOpen(true)} className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold shrink-0">
              <ArrowLeftRight className="w-4 h-4 mr-1.5" /> Request Introduction
            </Button>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div>
            <h3 className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">About</h3>
            <p className="font-body text-sm text-foreground leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.niche?.length > 0 && (
            <div>
              <h3 className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.niche.map((n: string) => (
                  <Badge key={n} variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[11px]">{n}</Badge>
                ))}
              </div>
            </div>
          )}

          {profile.languages?.length > 0 && (
            <div>
              <h3 className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" /> Languages
              </h3>
              <p className="font-body text-sm text-foreground">{profile.languages.join(", ")}</p>
            </div>
          )}

          {profile.can_help_with && (
            <div>
              <h3 className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Can Help With</h3>
              <p className="font-body text-sm text-foreground">{profile.can_help_with}</p>
            </div>
          )}

          {profile.looking_for && (
            <div>
              <h3 className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Looking For</h3>
              <p className="font-body text-sm text-foreground">{profile.looking_for}</p>
            </div>
          )}

          {profile.years_experience && (
            <div>
              <h3 className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Experience</h3>
              <p className="font-body text-sm text-foreground">{profile.years_experience} years</p>
            </div>
          )}
        </div>

        {/* Links */}
        {(profile.linkedin_url || profile.website_url || profile.instagram) && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-gold hover:text-gold-light transition-colors">LinkedIn →</a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-gold hover:text-gold-light transition-colors">Website →</a>
            )}
            {profile.instagram && (
              <a href={`https://instagram.com/${profile.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-gold hover:text-gold-light transition-colors">Instagram →</a>
            )}
          </div>
        )}
      </motion.div>

      {/* Recent opportunities by this member */}
      {recentOpps.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Active Opportunities</h3>
          <div className="space-y-3">
            {recentOpps.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{o.title}</p>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                    {o.opportunity_type} · {[o.market_city, o.market_country].filter(Boolean).join(", ")}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[10px]">{o.opportunity_type}</Badge>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Introduction Dialog */}
      <Dialog open={introOpen} onOpenChange={setIntroOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display">Request Introduction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="font-display text-sm font-bold text-gold">{(profile.full_name || "?")[0]}</span>
              </div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">{profile.full_name}</p>
                <p className="font-body text-xs text-muted-foreground">{[profile.city, profile.country].filter(Boolean).join(", ")}</p>
              </div>
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Why do you want to connect? *</Label>
              <Textarea value={introForm.reason} onChange={(e) => setIntroForm({ ...introForm, reason: e.target.value })} placeholder="I have a client looking to invest in your market..." className="bg-background border-border text-foreground font-body mt-1.5 min-h-[80px]" />
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Additional context (optional)</Label>
              <Textarea value={introForm.context} onChange={(e) => setIntroForm({ ...introForm, context: e.target.value })} placeholder="Budget range, timeline, specific requirements..." className="bg-background border-border text-foreground font-body mt-1.5 min-h-[60px]" />
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Urgency</Label>
              <Select value={introForm.urgency} onValueChange={(v) => setIntroForm({ ...introForm, urgency: v })}>
                <SelectTrigger className="bg-background border-border text-foreground font-body mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="low" className="font-body">Low — no rush</SelectItem>
                  <SelectItem value="normal" className="font-body">Normal</SelectItem>
                  <SelectItem value="high" className="font-body">High — time sensitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleRequestIntro} disabled={sending || !introForm.reason} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
              {sending ? "Sending..." : "Send Introduction Request"}
            </Button>
            <p className="font-body text-[10px] text-muted-foreground text-center">Introductions keep connections intentional and high quality</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberProfile;
