import { useEffect, useState } from "react";
import { Plus, FileText, Download, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const TEMPLATE_TYPES = [
  "Residential",
  "Commercial",
  "Ambassador Collaboration",
  "Off-Plan Developer",
];

const typeColors: Record<string, string> = {
  "Residential": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Commercial": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Ambassador Collaboration": "bg-gold/10 text-gold border-gold/20",
  "Off-Plan Developer": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const ReferralTemplates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    type: "Residential",
    version: "",
    download_link: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchTemplates = async () => {
    const { data } = await supabase.from("referral_templates").select("*").order("created_at", { ascending: false });
    setTemplates(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
    if (user) {
      supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
    }
  }, [user]);

  const openCreate = () => {
    setEditTemplate(null);
    setForm({ name: "", type: "Residential", version: "", download_link: "", description: "" });
    setFormOpen(true);
  };

  const openEdit = (t: any) => {
    setEditTemplate(t);
    setForm({ name: t.name, type: t.type, version: t.version || "", download_link: t.download_link, description: t.description || "" });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      type: form.type,
      version: form.version || null,
      download_link: form.download_link,
      description: form.description || null,
    };
    if (editTemplate) {
      const { error } = await supabase.from("referral_templates").update(payload).eq("id", editTemplate.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Template updated" }); setFormOpen(false); fetchTemplates(); }
    } else {
      const { error } = await supabase.from("referral_templates").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Template added" }); setFormOpen(false); fetchTemplates(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("referral_templates").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Template removed" });
    fetchTemplates();
  };

  const filtered = activeType === "All" ? templates : templates.filter((t) => t.type === activeType);

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-40 bg-secondary/40 rounded-md animate-pulse" />
      <div className="grid md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-secondary/30 rounded-xl animate-pulse" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Referral Templates</h2>
          <p className="font-body text-sm text-muted-foreground">Contracts, agreements and scripts — ready to download</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate} className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
            <Plus className="w-4 h-4 mr-1" /> Add Template
          </Button>
        )}
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2">
        {["All", ...TEMPLATE_TYPES].map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1.5 rounded-full font-body text-xs transition-colors border ${
              activeType === type
                ? "bg-gold/10 text-gold border-gold/30"
                : "bg-secondary/30 text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Templates list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
          <p className="font-body text-sm text-muted-foreground">No templates in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-gold/20 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-sm font-semibold text-foreground">{t.name}</h3>
                      {t.version && (
                        <span className="font-body text-[10px] text-muted-foreground">v{t.version}</span>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openEdit(t)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <Badge className={`mt-1.5 ${typeColors[t.type] || "bg-secondary text-muted-foreground"} font-body text-[10px]`}>
                    {t.type}
                  </Badge>
                  {t.description && (
                    <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">{t.description}</p>
                  )}
                </div>
              </div>
              <a
                href={t.download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gold/20 font-body text-xs text-gold hover:bg-gold/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Template
              </a>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display">{editTemplate ? "Edit Template" : "Add Template"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label className="font-body text-xs text-muted-foreground">Template Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. International Referral Agreement" className="bg-background border-border text-foreground font-body" />
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {TEMPLATE_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="font-body">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-body text-xs text-muted-foreground">Version</Label>
                <Input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="1.0" className="bg-background border-border text-foreground font-body" />
              </div>
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Download Link *</Label>
              <Input value={form.download_link} onChange={(e) => setForm({ ...form, download_link: e.target.value })} required placeholder="https://drive.google.com/..." className="bg-background border-border text-foreground font-body" />
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[70px]" placeholder="What is this template for?" />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
              {saving ? "Saving..." : editTemplate ? "Save Changes" : "Add Template"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralTemplates;
