import { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp, Pencil, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SOPLibrary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sops, setSops] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editSop, setEditSop] = useState<any>(null);
  const [form, setForm] = useState({ title: "", category: "", content: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      if (!data) {
        navigate("/dashboard", { replace: true });
        return;
      }
      setIsAdmin(true);
      fetchSops();
    });
  }, [user]);

  const fetchSops = async () => {
    const { data } = await supabase
      .from("sop_library")
      .select("*")
      .order("category", { ascending: true });
    setSops(data || []);
    setLoading(false);
  };

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const openCreate = () => {
    setEditSop(null);
    setForm({ title: "", category: "", content: "" });
    setFormOpen(true);
  };

  const openEdit = (s: any) => {
    setEditSop(s);
    setForm({ title: s.title, category: s.category || "", content: s.content });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      category: form.category || null,
      content: form.content,
    };
    if (editSop) {
      const { error } = await supabase.from("sop_library").update(payload).eq("id", editSop.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "SOP updated" }); setFormOpen(false); fetchSops(); }
    } else {
      const { error } = await supabase.from("sop_library").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "SOP added" }); setFormOpen(false); fetchSops(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("sop_library").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "SOP removed" });
    fetchSops();
  };

  // Group by category
  const grouped = sops.reduce<Record<string, any[]>>((acc, s) => {
    const cat = s.category || "Uncategorised";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  if (loading) return (
    <div className="space-y-3">
      <div className="h-8 w-32 bg-secondary/40 rounded-md animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-secondary/30 rounded-xl animate-pulse" />)}
    </div>
  );

  if (!isAdmin) return (
    <div className="text-center py-16">
      <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
      <p className="font-body text-sm text-muted-foreground">Admin access required.</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">SOP Library</h2>
          <p className="font-body text-sm text-muted-foreground">Standard operating procedures — admin only</p>
        </div>
        <Button onClick={openCreate} className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Add SOP
        </Button>
      </div>

      {sops.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <p className="font-body text-sm text-muted-foreground">No SOPs added yet. Click Add SOP to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-2 px-1">{category}</h3>
              <div className="space-y-2">
                {items.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    {/* Header row */}
                    <button
                      onClick={() => toggle(s.id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {s.category && (
                          <Badge variant="secondary" className="font-body text-[10px] bg-gold/10 text-gold border-gold/20 shrink-0">
                            {s.category}
                          </Badge>
                        )}
                        <span className="font-display text-sm font-semibold text-foreground">{s.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(s); }}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {expanded[s.id]
                          ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        }
                      </div>
                    </button>

                    {/* Expanded content */}
                    {expanded[s.id] && (
                      <div className="px-5 pb-5 border-t border-border">
                        <pre className="font-body text-sm text-foreground whitespace-pre-wrap leading-relaxed pt-4">
                          {s.content}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editSop ? "Edit SOP" : "Add SOP"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label className="font-body text-xs text-muted-foreground">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. New Member Onboarding" className="bg-background border-border text-foreground font-body" />
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Onboarding, Deals, Admin..." className="bg-background border-border text-foreground font-body" />
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Content *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                className="bg-background border-border text-foreground font-body min-h-[240px] font-mono text-xs"
                placeholder="Step-by-step process..."
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
              {saving ? "Saving..." : editSop ? "Save Changes" : "Add SOP"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SOPLibrary;
