import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Props {
  data: any[];
  onRefresh: () => void;
}

const AdminPartners = ({ data, onRefresh }: Props) => {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editPartner, setEditPartner] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", category: "General", description: "", website: "",
    who_they_help: "", use_cases: "", markets_served: "",
    internal_contact_name: "", internal_contact_email: "", internal_referral_structure: "", internal_notes: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("partners").insert({
      name: form.name,
      category: form.category,
      description: form.description || null,
      website: form.website || null,
      who_they_help: form.who_they_help || null,
      use_cases: form.use_cases || null,
      markets_served: form.markets_served ? form.markets_served.split(",").map(s => s.trim()).filter(Boolean) : null,
      internal_contact_name: form.internal_contact_name || null,
      internal_contact_email: form.internal_contact_email || null,
      internal_referral_structure: form.internal_referral_structure || null,
      internal_notes: form.internal_notes || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Partner added" });
      setCreateOpen(false);
      setForm({ name: "", category: "General", description: "", website: "", who_they_help: "", use_cases: "", markets_served: "", internal_contact_name: "", internal_contact_email: "", internal_referral_structure: "", internal_notes: "" });
      onRefresh();
    }
  };

  const handleEditSave = async () => {
    if (!editPartner) return;
    const { error } = await supabase.from("partners").update({
      name: editPartner.name,
      category: editPartner.category,
      description: editPartner.description || null,
      website: editPartner.website || null,
      who_they_help: editPartner.who_they_help || null,
      use_cases: editPartner.use_cases || null,
      markets_served: typeof editPartner.markets_served === "string"
        ? editPartner.markets_served.split(",").map((s: string) => s.trim()).filter(Boolean)
        : editPartner.markets_served,
      internal_contact_name: editPartner.internal_contact_name || null,
      internal_contact_email: editPartner.internal_contact_email || null,
      internal_referral_structure: editPartner.internal_referral_structure || null,
      internal_notes: editPartner.internal_notes || null,
    }).eq("id", editPartner.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Partner updated" });
      setEditOpen(false);
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("partners").delete().eq("id", id);
    toast({ title: "Partner removed" });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)} className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Add Partner
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="text-center py-12 font-body text-muted-foreground">No partners yet.</p>
      ) : data.map((p) => (
        <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-body text-sm font-medium text-foreground">{p.name}</p>
            <p className="font-body text-[11px] text-muted-foreground">{p.category}{p.markets_served?.length ? ` · ${p.markets_served.join(", ")}` : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setEditPartner({ ...p, markets_served: (p.markets_served || []).join(", ") }); setEditOpen(true); }} className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive h-8 w-8 p-0">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Add Partner</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="font-body text-xs text-muted-foreground">Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-background border-border text-foreground font-body" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Category *</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="FX / Currency, Tax, Legal..." /></div>
            </div>
            <div><Label className="font-body text-xs text-muted-foreground">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[60px]" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Who They Help</Label><Input value={form.who_they_help} onChange={(e) => setForm({ ...form, who_they_help: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Markets Served (comma separated)</Label><Input value={form.markets_served} onChange={(e) => setForm({ ...form, markets_served: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="Dubai, London, Marbella" /></div>
            <h4 className="font-display text-sm font-semibold text-foreground pt-2 border-t border-border">Internal (Admin Only)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="font-body text-xs text-muted-foreground">Contact Name</Label><Input value={form.internal_contact_name} onChange={(e) => setForm({ ...form, internal_contact_name: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Contact Email</Label><Input value={form.internal_contact_email} onChange={(e) => setForm({ ...form, internal_contact_email: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
            </div>
            <div><Label className="font-body text-xs text-muted-foreground">Referral Structure</Label><Textarea value={form.internal_referral_structure} onChange={(e) => setForm({ ...form, internal_referral_structure: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[40px]" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Internal Notes</Label><Textarea value={form.internal_notes} onChange={(e) => setForm({ ...form, internal_notes: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[40px]" /></div>
            <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">Add Partner</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Edit Partner</DialogTitle></DialogHeader>
          {editPartner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">Name</Label><Input value={editPartner.name} onChange={(e) => setEditPartner({ ...editPartner, name: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
                <div><Label className="font-body text-xs text-muted-foreground">Category</Label><Input value={editPartner.category} onChange={(e) => setEditPartner({ ...editPartner, category: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              </div>
              <div><Label className="font-body text-xs text-muted-foreground">Description</Label><Textarea value={editPartner.description || ""} onChange={(e) => setEditPartner({ ...editPartner, description: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[60px]" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Website</Label><Input value={editPartner.website || ""} onChange={(e) => setEditPartner({ ...editPartner, website: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Who They Help</Label><Input value={editPartner.who_they_help || ""} onChange={(e) => setEditPartner({ ...editPartner, who_they_help: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Markets Served</Label><Input value={editPartner.markets_served || ""} onChange={(e) => setEditPartner({ ...editPartner, markets_served: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              <h4 className="font-display text-sm font-semibold text-foreground pt-2 border-t border-border">Internal</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">Contact Name</Label><Input value={editPartner.internal_contact_name || ""} onChange={(e) => setEditPartner({ ...editPartner, internal_contact_name: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
                <div><Label className="font-body text-xs text-muted-foreground">Contact Email</Label><Input value={editPartner.internal_contact_email || ""} onChange={(e) => setEditPartner({ ...editPartner, internal_contact_email: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              </div>
              <div><Label className="font-body text-xs text-muted-foreground">Referral Structure</Label><Textarea value={editPartner.internal_referral_structure || ""} onChange={(e) => setEditPartner({ ...editPartner, internal_referral_structure: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[40px]" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Internal Notes</Label><Textarea value={editPartner.internal_notes || ""} onChange={(e) => setEditPartner({ ...editPartner, internal_notes: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[40px]" /></div>
              <Button onClick={handleEditSave} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPartners;
