import { useEffect, useState } from "react";
import { Search, MapPin, Globe, Mail, Filter, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  city: string | null;
  country: string | null;
  agency: string | null;
  niche: string[] | null;
  languages: string[] | null;
  role: string | null;
  instagram: string | null;
  can_help_with: string | null;
  looking_for: string | null;
  avatar_url: string | null;
}

const Directory = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("profiles").select("*").order("full_name");
      setProfiles(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const countries = [...new Set(profiles.map((p) => p.country).filter(Boolean))] as string[];

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (p.full_name || "").toLowerCase().includes(q) ||
      (p.city || "").toLowerCase().includes(q) ||
      (p.country || "").toLowerCase().includes(q) ||
      (p.agency || "").toLowerCase().includes(q) ||
      (p.niche || []).some((n) => n.toLowerCase().includes(q));
    const matchesCountry = countryFilter === "all" || p.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Member Directory</h2>
          <p className="font-body text-sm text-muted-foreground">{profiles.length} members across the global network</p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[160px] bg-card border-border text-foreground font-body">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="font-body">All Countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c} value={c} className="font-body">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border text-foreground font-body"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-muted-foreground">Loading directory...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 font-body text-muted-foreground">No members found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:border-gold/20 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="font-display text-base font-bold text-gold">{(p.full_name || "?")[0]}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold text-foreground truncate">{p.full_name || "Unnamed"}</h3>
                  {p.role && <p className="font-body text-xs text-gold/80">{p.role}</p>}
                  {(p.city || p.country) && (
                    <p className="flex items-center gap-1 font-body text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {[p.city, p.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {p.agency && (
                <p className="font-body text-xs text-muted-foreground">
                  <Globe className="w-3 h-3 inline mr-1" />{p.agency}
                </p>
              )}

              {p.niche && p.niche.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.niche.slice(0, 4).map((n) => (
                    <Badge key={n} variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[10px]">{n}</Badge>
                  ))}
                  {p.niche.length > 4 && <Badge variant="secondary" className="bg-secondary text-muted-foreground font-body text-[10px]">+{p.niche.length - 4}</Badge>}
                </div>
              )}

              {p.languages && p.languages.length > 0 && (
                <p className="font-body text-[10px] text-muted-foreground/70">🌐 {p.languages.join(", ")}</p>
              )}

              {p.can_help_with && (
                <p className="font-body text-[10px] text-muted-foreground/70 line-clamp-1">💡 {p.can_help_with}</p>
              )}

              <div className="flex items-center gap-3 pt-1 border-t border-border">
                {p.email && (
                  <a href={`mailto:${p.email}`} className="flex items-center gap-1 font-body text-[10px] text-gold hover:text-gold-light transition-colors">
                    <Mail className="w-3 h-3" />Email
                  </a>
                )}
                {p.instagram && (
                  <a href={`https://instagram.com/${p.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-body text-[10px] text-gold hover:text-gold-light transition-colors">
                    <Instagram className="w-3 h-3" />{p.instagram}
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

export default Directory;
