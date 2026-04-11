import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X, Plus, Shield, Users, TrendingUp, ArrowLeftRight, Briefcase, Trophy, CalendarDays, Handshake, Building2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import AdminMembers from "@/components/admin/AdminMembers";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminInvestments from "@/components/admin/AdminInvestments";
import AdminCollaborations from "@/components/admin/AdminCollaborations";
import AdminPartners from "@/components/admin/AdminPartners";

type AdminTab = "members" | "opportunities" | "investments" | "collaborations" | "introductions" | "deals" | "events" | "partners" | "updates" | "community";

const tabs: { id: AdminTab; label: string; icon: any }[] = [
  { id: "members", label: "Members", icon: Users },
  { id: "opportunities", label: "Opportunities", icon: TrendingUp },
  { id: "investments", label: "Investments", icon: Building2 },
  { id: "collaborations", label: "Collaborations", icon: Handshake },
  { id: "introductions", label: "Intros", icon: ArrowLeftRight },
  { id: "deals", label: "Deals", icon: Briefcase },
  { id: "events", label: "Calls", icon: CalendarDays },
  { id: "partners", label: "Partners", icon: Briefcase },
  { id: "updates", label: "Updates", icon: Trophy },
  { id: "community", label: "Community", icon: MessageCircle },
];

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("members");
  const [data, setData] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [listings, setListings] = useState<Record<string, string>>({});
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({ type: "update", title: "", summary: "", content: "", markets: "" });

  useEffect(() => {
    if (!user) return;
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data: hasRole }) => {
      setIsAdmin(!!hasRole);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchTabData();
  }, [isAdmin, activeTab]);

  const fetchTabData = async () => {
    const profilesRes = await supabase.from("profiles").select("user_id, full_name");
    const map: Record<string, string> = {};
    (profilesRes.data || []).forEach((p: any) => { map[p.user_id] = p.full_name || "Member"; });
    setProfiles(map);

    let res;
    switch (activeTab) {
      case "members":
        res = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        break;
      case "opportunities":
        res = await supabase.from("referral_opportunities").select("*").order("created_at", { ascending: false });
        break;
      case "investments":
        res = await (supabase.from("investment_listings" as any).select("*") as any).order("created_at", { ascending: false });
        break;
      case "collaborations": {
        const [collabRes, listingsRes] = await Promise.all([
          (supabase.from("collaboration_requests" as any).select("*") as any).order("created_at", { ascending: false }),
          (supabase.from("investment_listings" as any).select("id, title") as any),
        ]);
        const listingMap: Record<string, string> = {};
        (listingsRes.data || []).forEach((l: any) => { listingMap[l.id] = l.title; });
        setListings(listingMap);
        res = collabRes;
        break;
      }
      case "introductions":
        res = await supabase.from("introductions").select("*").order("created_at", { ascending: false });
        break;
      case "deals":
        res = await supabase.from("deals").select("*").order("created_at", { ascending: false });
        break;
      case "events":
        res = await supabase.from("events").select("*").order("event_date", { ascending: false });
        break;
      case "partners":
        res = await supabase.from("partners").select("*").order("name");
        break;
      case "updates":
        res = await supabase.from("network_updates").select("*").order("created_at", { ascending: false });
        break;
      case "community":
        res = await supabase.from("community_members").select("*").order("created_at", { ascending: false });
        break;
    }
    setData(res?.data || []);
  };

  const handleIntroAction = async (id: string, status: string) => {
    await supabase.from("introductions").update({ status }).eq("id", id);
    toast({ title: `Introduction ${status}` });
    fetchTabData();
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await supabase.from("referral_opportunities").update({ featured: !featured }).eq("id", id);
    toast({ title: featured ? "Unfeatured" : "Featured" });
    fetchTabData();
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("network_updates").insert({
      type: updateForm.type,
      title: updateForm.title,
      summary: updateForm.summary || null,
      content: updateForm.content || null,
      markets: updateForm.markets ? updateForm.markets.split(",").map(s => s.trim()).filter(Boolean) : null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Update published" });
      setUpdateOpen(false);
      setUpdateForm({ type: "update", title: "", summary: "", content: "", markets: "" });
      fetchTabData();
    }
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-8 w-24 bg-secondary/40 rounded-md animate-pulse" />)}</div>
      <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-secondary/30 rounded-xl animate-pulse" />)}</div>
    </div>
  );
  if (!isAdmin) return <div className="text-center py-16 font-body text-muted-foreground"><Shield className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Admin access required.</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Admin Panel</h2>
          <p className="font-body text-sm text-muted-foreground">Full network control — members, deals, content, calls</p>
        </div>
        {activeTab === "updates" && (
          <Button onClick={() => setUpdateOpen(true)} className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
            <Plus className="w-4 h-4 mr-1" /> New Update
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-secondary/30 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-body text-xs transition-colors ${
              activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "members" ? (
          <AdminMembers data={data} onRefresh={fetchTabData} />
        ) : activeTab === "events" ? (
          <AdminEvents data={data} onRefresh={fetchTabData} />
        ) : activeTab === "investments" ? (
          <AdminInvestments data={data} profiles={profiles} onRefresh={fetchTabData} />
        ) : activeTab === "collaborations" ? (
          <AdminCollaborations data={data} profiles={profiles} listings={listings} onRefresh={fetchTabData} />
        ) : activeTab === "partners" ? (
          <AdminPartners data={data} onRefresh={fetchTabData} />
        ) : activeTab === "introductions" ? (
          <div className="space-y-3">
            {data.length === 0 ? <p className="text-center py-12 font-body text-muted-foreground">No introductions.</p> : data.map((i) => (
              <div key={i.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-body text-sm text-foreground">
                    <span className="font-medium">{profiles[i.requester_id] || "Member"}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-medium">{profiles[i.target_id] || "Member"}</span>
                  </p>
                  <Badge variant="secondary" className={`font-body text-[10px] ${i.status === "pending" ? "bg-yellow-500/10 text-yellow-400" : i.status === "accepted" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {i.status}
                  </Badge>
                </div>
                {i.reason && <p className="font-body text-xs text-muted-foreground italic">"{i.reason}"</p>}
                <div className="flex items-center gap-2">
                  <span className="font-body text-[10px] text-muted-foreground">{format(new Date(i.created_at), "MMM d, yyyy")}</span>
                  {i.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handleIntroAction(i.id, "accepted")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-body text-xs h-7 ml-auto">
                        <Check className="w-3 h-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleIntroAction(i.id, "declined")} className="border-border text-muted-foreground font-body text-xs h-7">
                        <X className="w-3 h-3 mr-1" /> Decline
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "opportunities" ? (
          <div className="space-y-3">
            {data.length === 0 ? <p className="text-center py-12 font-body text-muted-foreground">No opportunities.</p> : data.map((o) => (
              <div key={o.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{o.title}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{o.opportunity_type} · {[o.market_city, o.market_country].filter(Boolean).join(", ")} · by {profiles[o.posted_by] || "Member"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleToggleFeatured(o.id, o.featured)} className={`font-body text-xs h-7 ${o.featured ? "border-gold/30 text-gold" : "border-border text-muted-foreground"}`}>
                    {o.featured ? "★ Featured" : "Feature"}
                  </Button>
                  <Badge variant="secondary" className={`font-body text-[10px] ${o.status === "open" ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                    {o.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "deals" ? (
          <div className="space-y-3">
            {data.length === 0 ? <p className="text-center py-12 font-body text-muted-foreground">No deals.</p> : data.map((d) => (
              <div key={d.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{d.title}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{d.stage || d.status} · {[d.city, d.country].filter(Boolean).join(", ")}{d.estimated_value ? ` · $${Number(d.estimated_value).toLocaleString()}` : ""} · {profiles[d.created_by] || "Member"}</p>
                </div>
                <Badge variant="secondary" className="font-body text-[10px]">{d.stage || d.status}</Badge>
              </div>
            ))}
          </div>
        ) : activeTab === "updates" ? (
          <div className="space-y-3">
            {data.length === 0 ? <p className="text-center py-12 font-body text-muted-foreground">No updates.</p> : data.map((u) => (
              <div key={u.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`font-body text-[10px] ${u.type === "win" ? "bg-gold/10 text-gold border-gold/20" : "bg-secondary text-muted-foreground"}`}>
                      {u.type}
                    </Badge>
                    <p className="font-body text-sm font-medium text-foreground">{u.title}</p>
                  </div>
                  {u.summary && <p className="font-body text-[11px] text-muted-foreground mt-1">{u.summary}</p>}
                </div>
                <span className="font-body text-[10px] text-muted-foreground">{format(new Date(u.created_at), "MMM d")}</span>
              </div>
            ))}
          </div>
        ) : activeTab === "community" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-sm text-muted-foreground">{data.length} free community member{data.length !== 1 ? "s" : ""}</p>
            </div>
            {data.length === 0 ? <p className="text-center py-12 font-body text-muted-foreground">No community signups yet.</p> : data.map((m) => (
              <div key={m.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{[m.first_name, m.last_name].filter(Boolean).join(" ")}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{m.whatsapp}{m.email ? ` · ${m.email}` : ""} · {[m.city, m.country].filter(Boolean).join(", ")}</p>
                  {m.role && <p className="font-body text-[10px] text-muted-foreground">{m.role}{m.how_did_you_hear ? ` · via ${m.how_did_you_hear}` : ""}</p>}
                  <p className="font-body text-[10px] text-muted-foreground">{format(new Date(m.created_at), "MMM d, yyyy")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={`font-body text-[10px] ${m.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                    {m.status}
                  </Badge>
                  {m.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-body text-xs h-7 border-border text-muted-foreground hover:text-destructive hover:border-destructive/30"
                      onClick={async () => {
                        await supabase.from("community_members").update({ status: "removed" }).eq("id", m.id);
                        toast({ title: "Member removed from community" });
                        fetchTabData();
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Create Update Dialog */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader><DialogTitle className="font-display">Publish Update or Win</DialogTitle></DialogHeader>
          <form onSubmit={handleCreateUpdate} className="space-y-4">
            <div>
              <Label className="font-body text-xs text-muted-foreground">Type</Label>
              <Select value={updateForm.type} onValueChange={(v) => setUpdateForm({ ...updateForm, type: v })}>
                <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="update" className="font-body">Network Update</SelectItem>
                  <SelectItem value="win" className="font-body">Win / Success Story</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="font-body text-xs text-muted-foreground">Title *</Label><Input value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} required className="bg-background border-border text-foreground font-body" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Summary</Label><Textarea value={updateForm.summary} onChange={(e) => setUpdateForm({ ...updateForm, summary: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[60px]" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Markets (comma separated)</Label><Input value={updateForm.markets} onChange={(e) => setUpdateForm({ ...updateForm, markets: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="Dubai, London, Marbella" /></div>
            <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">Publish</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
