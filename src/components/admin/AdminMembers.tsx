import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Search } from "lucide-react";

interface Props {
  data: any[];
  onRefresh: () => void;
}

const AdminMembers = ({ data, onRefresh }: Props) => {
  const { toast } = useToast();
  const GHL_ACCEPTED_WEBHOOK = "https://n8n.therealty-network.com/webhook/trn-accepted-member";

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editMember, setEditMember] = useState<any>(null);
  const [originalApprovalStatus, setOriginalApprovalStatus] = useState<string>("");
  const [memberForm, setMemberForm] = useState({ email: "", password: "", full_name: "" });
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const { data: result, error } = await supabase.functions.invoke("create-member", { body: memberForm });
    if (error || result?.error) {
      toast({ title: "Error", description: result?.error || error?.message, variant: "destructive" });
    } else {
      toast({ title: "Member created", description: `${memberForm.email} can now log in.` });
      setCreateOpen(false);
      setMemberForm({ email: "", password: "", full_name: "" });
      onRefresh();
    }
    setCreating(false);
  };

  const handleEditSave = async () => {
    if (!editMember) return;
    const { error } = await supabase.from("profiles").update({
      full_name: editMember.full_name,
      city: editMember.city,
      country: editMember.country,
      agency: editMember.agency,
      role: editMember.role,
      approval_status: editMember.approval_status,
      bio: editMember.bio,
      title: editMember.title,
    }).eq("id", editMember.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    // Fire GHL/n8n webhook when a member is approved for the first time
    if (editMember.approval_status === "approved" && originalApprovalStatus !== "approved") {
      const [firstName, ...rest] = (editMember.full_name || "").split(" ");
      try {
        await fetch(GHL_ACCEPTED_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: editMember.email,
            first_name: firstName || editMember.full_name,
            last_name: rest.join(" ") || "",
            full_name: editMember.full_name,
            country: editMember.country,
            city: editMember.city,
            agency: editMember.agency,
            role: editMember.role,
          }),
        });
      } catch {
        // Webhook failure is silent — profile is already saved
      }
    }
    toast({ title: "Member updated" });
    setEditOpen(false);
    onRefresh();
  };

  const filtered = data.filter((m) => {
    const q = search.toLowerCase();
    return !q || m.full_name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.country?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-background border-border text-foreground font-body" />
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Create Member
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-12 font-body text-muted-foreground">No members found.</p>
      ) : filtered.map((m) => (
        <div key={m.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-body text-sm font-medium text-foreground">{m.full_name || "No name"}</p>
            <p className="font-body text-[11px] text-muted-foreground">{m.email} · {[m.city, m.country].filter(Boolean).join(", ") || "No location"}</p>
            {m.agency && <p className="font-body text-[10px] text-muted-foreground">{m.agency}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`font-body text-[10px] ${m.approval_status === "approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : m.approval_status === "rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
              {m.approval_status}
            </Badge>
            <Button size="sm" variant="ghost" onClick={() => { setEditMember({ ...m }); setOriginalApprovalStatus(m.approval_status || ""); setEditOpen(true); }} className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}

      {/* Create Member */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader><DialogTitle className="font-display">Create New Member</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div><Label className="font-body text-xs text-muted-foreground">Full Name *</Label><Input value={memberForm.full_name} onChange={(e) => setMemberForm({ ...memberForm, full_name: e.target.value })} required className="bg-background border-border text-foreground font-body" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Email *</Label><Input type="email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} required className="bg-background border-border text-foreground font-body" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Password *</Label><Input type="text" value={memberForm.password} onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })} required className="bg-background border-border text-foreground font-body" placeholder="Set a temporary password" /></div>
            <Button type="submit" disabled={creating} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
              {creating ? "Creating..." : "Create Member Account"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Member */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Edit Member</DialogTitle></DialogHeader>
          {editMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">Full Name</Label><Input value={editMember.full_name || ""} onChange={(e) => setEditMember({ ...editMember, full_name: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
                <div><Label className="font-body text-xs text-muted-foreground">Title</Label><Input value={editMember.title || ""} onChange={(e) => setEditMember({ ...editMember, title: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">City</Label><Input value={editMember.city || ""} onChange={(e) => setEditMember({ ...editMember, city: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
                <div><Label className="font-body text-xs text-muted-foreground">Country</Label><Input value={editMember.country || ""} onChange={(e) => setEditMember({ ...editMember, country: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body text-xs text-muted-foreground">Agency</Label><Input value={editMember.agency || ""} onChange={(e) => setEditMember({ ...editMember, agency: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
                <div><Label className="font-body text-xs text-muted-foreground">Role</Label><Input value={editMember.role || ""} onChange={(e) => setEditMember({ ...editMember, role: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Status</Label>
                <Select value={editMember.approval_status} onValueChange={(v) => setEditMember({ ...editMember, approval_status: v })}>
                  <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="approved" className="font-body">Approved</SelectItem>
                    <SelectItem value="pending" className="font-body">Pending</SelectItem>
                    <SelectItem value="rejected" className="font-body">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="font-body text-xs text-muted-foreground">Bio</Label><Textarea value={editMember.bio || ""} onChange={(e) => setEditMember({ ...editMember, bio: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[60px]" /></div>
              <Button onClick={handleEditSave} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembers;
