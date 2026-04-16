import { useEffect, useState } from "react";
import { Plus, BookOpen, ExternalLink, Pencil, Trash2 } from "lucide-react";
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

const CATEGORIES = ["All", "General", "Market Reports", "Legal", "Finance", "Guides", "Scripts"];

const categoryColors: Record<string, string> = {
  "General": "bg-secondary text-muted-foreground border-border",
  "Market Reports": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Legal": "bg-red-500/10 text-red-400 border-red-500/20",
  "Finance": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Guides": "bg-gold/10 text-gold border-gold/20",
  "Scripts": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const EducationHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editResource, setEditResource] = useState<any>(null);
  const [form, setForm] = useState({ title: "", category: "General", author: "", content: "", link: "" });
  const [saving, setSaving] = useState(false);

  const fetchResources = async () => {
    const { data } = await supabase
      .from("knowledge_resources")
      .select("*")
      .order("created_at", { ascending: false });
    setResources(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
    if (user) {
      supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
    }
  }, [user]);

  const openCreate = () => {
    setEditResource(null);
    setForm({ title: "", category: "General", author: "", content: "", link: "" });
    setFormOpen(true);
  };

  const openEdit = (r: any) => {
    setEditResource(r);
    setForm({ title: r.title, category: r.category, author: r.author || "", content: r.content || "", link: r.link || "" });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      category: form.category,
      author: form.author || null,
      content: form.content || null,
      link: form.link || null,
    };
    if (editResource) {
      const { error } = await supabase.from("knowledge_resources").update(payload).eq("id", editResource.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Resource updated" }); setFormOpen(false); fetchResources(); }
    } else {
      const { error } = await supabase.from("knowledge_resources").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Resource added" }); setFormOpen(false); fetchResources(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("knowledge_resources").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Resource removed" });
    fetchResources();
  };

  const filtered = activeCategory === "All" ? resources : resources.filter((r) => r.category === activeCategory);

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-40 bg-secondary/40 rounded-md animate-pulse" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 bg-secondary/30 rounded-xl animate-pulse" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Education Hub</h2>
          <p className="font-body text-sm text-muted-foreground">Market reports, legal guides, scripts and resources</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate} className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
            <Plus className="w-4 h-4 mr-1" /> Add Resource
          </Button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-body text-xs transition-colors border ${
              activeCategory === cat
                ? "bg-gold/10 text-gold border-gold/30"
                : "bg-secondary/30 text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
          <p className="font-body text-sm text-muted-foreground">No resources in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-gold/20 transition-all flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-gold" />
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(r)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="font-display text-sm font-semibold text-foreground leading-snug mb-1">{r.title}</h3>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className={`${categoryColors[r.category] || categoryColors["General"]} font-body text-[10px]`}>
                  {r.category}
                </Badge>
                {r.author && (
                  <span className="font-body text-[10px] text-muted-foreground">{r.author}</span>
                )}
              </div>

              {r.content && (
                <p className="font-body text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">{r.content}</p>
              )}

              {r.link && (
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gold/20 font-body text-xs text-gold hover:bg-gold/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Resource
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border text-foreground w-[calc(100vw-2rem)] sm:w-auto max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{editResource ? "Edit Resource" : "Add Resource"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label className="font-body text-xs text-muted-foreground">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-background border-border text-foreground font-body" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-body text-xs text-muted-foreground">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <SelectItem key={c} value={c} className="font-body">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Author</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="TRN Team" />
              </div>
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Description / Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[80px]" placeholder="Brief description of the resource..." />
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Link</Label>
              <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." className="bg-background border-border text-foreground font-body" />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
              {saving ? "Saving..." : editResource ? "Save Changes" : "Add Resource"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationHub;
