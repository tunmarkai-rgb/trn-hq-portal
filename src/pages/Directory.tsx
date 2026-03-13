import { useEffect, useState } from "react";
import { Search, MapPin, Globe, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

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
}

const Directory = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("profiles").select("*").order("full_name");
      setProfiles(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.full_name || "").toLowerCase().includes(q) ||
      (p.city || "").toLowerCase().includes(q) ||
      (p.country || "").toLowerCase().includes(q) ||
      (p.agency || "").toLowerCase().includes(q) ||
      (p.niche || []).some((n) => n.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[hsl(220,15%,90%)]">Member Directory</h2>
          <p className="font-body text-sm text-[hsl(220,10%,50%)]">{profiles.length} members</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,10%,40%)]" />
          <Input
            placeholder="Search by name, city, niche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[hsl(220,25%,10%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-[hsl(220,10%,50%)]">Loading directory...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 font-body text-[hsl(220,10%,50%)]">No members found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-5 space-y-3">
              <div>
                <h3 className="font-display text-lg font-semibold text-[hsl(220,15%,85%)]">
                  {p.full_name || "Unnamed"}
                </h3>
                {(p.city || p.country) && (
                  <p className="flex items-center gap-1 font-body text-sm text-[hsl(220,10%,50%)] mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {[p.city, p.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>

              {p.agency && (
                <p className="font-body text-sm text-[hsl(220,10%,55%)]">
                  <Globe className="w-3.5 h-3.5 inline mr-1" />{p.agency}
                </p>
              )}

              {p.niche && p.niche.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.niche.map((n) => (
                    <Badge key={n} variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-xs">
                      {n}
                    </Badge>
                  ))}
                </div>
              )}

              {p.languages && p.languages.length > 0 && (
                <p className="font-body text-xs text-[hsl(220,10%,45%)]">
                  🌐 {p.languages.join(", ")}
                </p>
              )}

              {p.email && (
                <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 font-body text-xs text-gold hover:text-gold-light">
                  <Mail className="w-3.5 h-3.5" />{p.email}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Directory;
