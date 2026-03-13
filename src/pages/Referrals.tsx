import { useEffect, useState } from "react";
import { Plus, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Accepted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "In Progress": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Closed: "bg-green-500/10 text-green-400 border-green-500/20",
  Declined: "bg-red-500/10 text-red-400 border-red-500/20",
};

const Referrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ client_name: "", client_contact: "", property_type: "", location: "", notes: "", referral_fee_percent: "" });

  const fetchReferrals = async () => {
    if (!user) return;
    const { data } = await supabase.from("referrals").select("*").order("created_at", { ascending: false });
    setReferrals(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReferrals(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("referrals").insert({
      ...form,
      sent_by: user.id,
      referral_fee_percent: form.referral_fee_percent ? Number(form.referral_fee_percent) : null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Referral created" });
      setOpen(false);
      setForm({ client_name: "", client_contact: "", property_type: "", location: "", notes: "", referral_fee_percent: "" });
      fetchReferrals();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[hsl(220,15%,90%)]">Referral Exchange</h2>
          <p className="font-body text-sm text-[hsl(220,10%,50%)]">Send and track client referrals</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-navy font-body font-semibold">
              <Plus className="w-4 h-4 mr-1" /> New Referral
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[hsl(220,25%,10%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)]">
            <DialogHeader><DialogTitle className="font-display">New Referral</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><Label className="font-body text-[hsl(220,10%,55%)]">Client Name *</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              <div><Label className="font-body text-[hsl(220,10%,55%)]">Client Contact</Label><Input value={form.client_contact} onChange={(e) => setForm({ ...form, client_contact: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-[hsl(220,10%,55%)]">Property Type</Label><Input value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
                <div><Label className="font-body text-[hsl(220,10%,55%)]">Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              </div>
              <div><Label className="font-body text-[hsl(220,10%,55%)]">Referral Fee %</Label><Input type="number" value={form.referral_fee_percent} onChange={(e) => setForm({ ...form, referral_fee_percent: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              <div><Label className="font-body text-[hsl(220,10%,55%)]">Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold">Send Referral</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-[hsl(220,10%,50%)]">Loading referrals...</div>
      ) : referrals.length === 0 ? (
        <div className="text-center py-16 font-body text-[hsl(220,10%,50%)]">
          <Handshake className="w-12 h-12 mx-auto mb-3 text-[hsl(220,10%,30%)]" />
          <p>No referrals yet. Send your first one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {referrals.map((r) => (
            <div key={r.id} className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-[hsl(220,15%,85%)]">{r.client_name}</h3>
                <p className="font-body text-sm text-[hsl(220,10%,50%)] mt-1">
                  {[r.property_type, r.location].filter(Boolean).join(" • ")}
                  {r.referral_fee_percent && ` • ${r.referral_fee_percent}% fee`}
                </p>
              </div>
              <Badge className={`${statusColors[r.status] || ""} font-body`}>{r.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Referrals;
