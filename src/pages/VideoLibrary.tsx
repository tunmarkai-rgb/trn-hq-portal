import { useEffect, useState } from "react";
import { Plus, Play, X, Pencil, Trash2 } from "lucide-react";
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

const CATEGORIES = [
  "All",
  "Deal Structuring",
  "Legal",
  "Market Intelligence",
  "Referral",
  "Mindset",
  "Guest Speaker",
  "General",
];

const categoryColors: Record<string, string> = {
  "Deal Structuring": "bg-gold/10 text-gold border-gold/20",
  "Legal": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Market Intelligence": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Referral": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Mindset": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Guest Speaker": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "General": "bg-secondary text-muted-foreground",
};

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] ?? null;
};

const VideoLibrary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [videos, setVideos] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [embedVideo, setEmbedVideo] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editVideo, setEditVideo] = useState<any>(null);
  const [form, setForm] = useState({ title: "", category: "General", youtube_url: "", description: "" });
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    setVideos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
    if (user) {
      supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
    }
  }, [user]);

  const openCreate = () => {
    setEditVideo(null);
    setForm({ title: "", category: "General", youtube_url: "", description: "" });
    setFormOpen(true);
  };

  const openEdit = (v: any) => {
    setEditVideo(v);
    setForm({ title: v.title, category: v.category, youtube_url: v.youtube_url, description: v.description || "" });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      category: form.category,
      youtube_url: form.youtube_url,
      description: form.description || null,
    };
    if (editVideo) {
      const { error } = await supabase.from("videos").update(payload).eq("id", editVideo.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Video updated" }); setFormOpen(false); fetchVideos(); }
    } else {
      const { error } = await supabase.from("videos").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Video added" }); setFormOpen(false); fetchVideos(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Video removed" });
    fetchVideos();
  };

  const filtered = activeCategory === "All" ? videos : videos.filter((v) => v.category === activeCategory);

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-40 bg-secondary/40 rounded-md animate-pulse" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-secondary/30 rounded-xl animate-pulse" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Video Library</h2>
          <p className="font-body text-sm text-muted-foreground">Training, deal structuring, market intelligence and more</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate} className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
            <Plus className="w-4 h-4 mr-1" /> Add Video
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

      {/* Video grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Play className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
          <p className="font-body text-sm text-muted-foreground">No videos in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v, i) => {
            const ytId = getYouTubeId(v.youtube_url);
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border rounded-xl overflow-hidden group hover:border-gold/20 transition-all"
              >
                {/* Thumbnail */}
                <button
                  onClick={() => setEmbedVideo(v)}
                  className="relative w-full aspect-video bg-secondary/50 overflow-hidden block"
                >
                  {ytId ? (
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center">
                      <Play className="w-5 h-5 text-navy ml-0.5" />
                    </div>
                  </div>
                </button>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-sm font-semibold text-foreground leading-snug">{v.title}</h3>
                    {isAdmin && (
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openEdit(v)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(v.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <Badge className={`${categoryColors[v.category] || categoryColors["General"]} font-body text-[10px]`}>
                    {v.category}
                  </Badge>
                  {v.description && (
                    <p className="font-body text-xs text-muted-foreground line-clamp-2">{v.description}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Embed modal */}
      <Dialog open={!!embedVideo} onOpenChange={(open) => !open && setEmbedVideo(null)}>
        <DialogContent className="bg-card border-border text-foreground w-[calc(100vw-2rem)] sm:w-auto sm:max-w-3xl p-0 overflow-hidden">
          {embedVideo && (
            <>
              <div className="relative aspect-video bg-black">
                {getYouTubeId(embedVideo.youtube_url) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(embedVideo.youtube_url)}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="font-body text-sm text-muted-foreground">Invalid YouTube URL</p>
                  </div>
                )}
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-foreground">{embedVideo.title}</h3>
                  <Badge className={`${categoryColors[embedVideo.category] || categoryColors["General"]} font-body text-[10px]`}>
                    {embedVideo.category}
                  </Badge>
                </div>
                {embedVideo.description && (
                  <p className="font-body text-sm text-muted-foreground">{embedVideo.description}</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add / Edit form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border text-foreground w-[calc(100vw-2rem)] sm:w-auto max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{editVideo ? "Edit Video" : "Add Video"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label className="font-body text-xs text-muted-foreground">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-background border-border text-foreground font-body" />
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">YouTube URL *</Label>
              <Input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} required placeholder="https://youtu.be/... or youtube.com/watch?v=..." className="bg-background border-border text-foreground font-body" />
            </div>
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
              <Label className="font-body text-xs text-muted-foreground">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[70px]" />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
              {saving ? "Saving..." : editVideo ? "Save Changes" : "Add Video"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoLibrary;
