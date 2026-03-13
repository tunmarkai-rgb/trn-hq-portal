import { useEffect, useState } from "react";
import { Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  Active: "bg-green-500/10 text-green-400 border-green-500/20",
  "Under Contract": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Closed: "bg-gold/10 text-gold border-gold/20",
  Lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

const Deals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", property_address: "", city: "", country: "", estimated_value: "", status: "Active", notes: "" });

  const fetchDeals = async () => {
    if (!user) return;
    const { data } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
    setDeals(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDeals(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("deals").insert({
      ...form,
      created_by: user.id,
      estimated_value: form.estimated_value ? Number(form.estimated_value) : null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deal created" });
      setOpen(false);
      setForm({ title: "", property_address: "", city: "", country: "", estimated_value: "", status: "Active", notes: "" });
      fetchDeals();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[hsl(220,15%,90%)]">Deal Tracker</h2>
          <p className="font-body text-sm text-[hsl(220,10%,50%)]">Track live deals with your partners</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-navy font-body font-semibold">
              <Plus className="w-4 h-4 mr-1" /> New Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[hsl(220,25%,10%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)]">
            <DialogHeader>
              <DialogTitle className="font-display">New Deal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><Label className="font-body text-[hsl(220,10%,55%)]">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              <div><Label className="font-body text-[hsl(220,10%,55%)]">Property Address</Label><Input value={form.property_address} onChange={(e) => setForm({ ...form, property_address: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-[hsl(220,10%,55%)]">City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
                <div><Label className="font-body text-[hsl(220,10%,55%)]">Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              </div>
              <div><Label className="font-body text-[hsl(220,10%,55%)]">Estimated Value</Label><Input type="number" value={form.estimated_value} onChange={(e) => setForm({ ...form, estimated_value: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              <div><Label className="font-body text-[hsl(220,10%,55%)]">Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body" /></div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold">Create Deal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-[hsl(220,10%,50%)]">Loading deals...</div>
      ) : deals.length === 0 ? (
        <div className="text-center py-16 font-body text-[hsl(220,10%,50%)]">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-[hsl(220,10%,30%)]" />
          <p>No deals yet. Create your first deal to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((d) => (
            <div key={d.id} className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-[hsl(220,15%,85%)]">{d.title}</h3>
                <p className="font-body text-sm text-[hsl(220,10%,50%)] mt-1">
                  {[d.city, d.country].filter(Boolean).join(", ")}
                  {d.estimated_value && ` • $${Number(d.estimated_value).toLocaleString()}`}
                </p>
              </div>
              <Badge className={`${statusColors[d.status] || ""} font-body`}>{d.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Deals;
