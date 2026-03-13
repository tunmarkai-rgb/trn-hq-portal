import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, User, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format } from "date-fns";

const categoryColors: Record<string, string> = {
  "Referral Systems": "bg-gold/10 text-gold border-gold/20",
  "Deal Strategies": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Networking: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Marketing: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Market Intel": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  General: "bg-secondary text-muted-foreground",
};

const Knowledge = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("knowledge_resources").select("*").order("created_at", { ascending: false });
      setResources(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = [...new Set(resources.map((r) => r.category))];

  const filtered = resources.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch = r.title.toLowerCase().includes(q) || (r.content || "").toLowerCase().includes(q) || (r.author || "").toLowerCase().includes(q);
    const matchesCat = categoryFilter === "all" || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Knowledge & Strategy</h2>
          <p className="font-body text-sm text-muted-foreground">Curated insights, guides, and market intelligence</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border text-foreground font-body" />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCategoryFilter("all")} className={`px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${categoryFilter === "all" ? "bg-gold/20 text-gold" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
          All
        </button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${categoryFilter === cat ? "bg-gold/20 text-gold" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-muted-foreground">Loading resources...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 font-body text-muted-foreground">No resources found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-card border border-border rounded-2xl p-5 hover:border-gold/20 transition-all duration-300 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-foreground">{r.title}</h3>
                <Badge className={`${categoryColors[r.category] || "bg-secondary text-muted-foreground"} font-body text-[10px] shrink-0`}>{r.category}</Badge>
              </div>
              {r.content && <p className="font-body text-sm text-muted-foreground line-clamp-3">{r.content}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-body text-xs text-muted-foreground/70">
                  {r.author && <span className="flex items-center gap-1"><User className="w-3 h-3" />{r.author}</span>}
                  <span>{format(new Date(r.created_at), "MMM d, yyyy")}</span>
                </div>
                {r.link && (
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Open
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Knowledge;
