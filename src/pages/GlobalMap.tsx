import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface MemberLocation {
  full_name: string | null;
  city: string | null;
  country: string | null;
  agency: string | null;
  latitude: number | null;
  longitude: number | null;
  niche: string[] | null;
}

const GlobalMap = () => {
  const [members, setMembers] = useState<MemberLocation[]>([]);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, city, country, agency, latitude, longitude, niche")
        .not("latitude", "is", null);
      setMembers((data as MemberLocation[]) || []);
      setLoading(false);
    };
    fetchMembers();

    // Dynamic import for Leaflet (SSR-safe)
    import("@/components/MapView").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  const countryGroups = members.reduce((acc, m) => {
    const country = m.country || "Unknown";
    if (!acc[country]) acc[country] = [];
    acc[country].push(m);
    return acc;
  }, {} as Record<string, MemberLocation[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Global Network</h2>
        <p className="font-body text-sm text-muted-foreground">{members.length} members mapped worldwide</p>
      </div>

      {/* Map */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-2xl overflow-hidden" style={{ height: "500px" }}>
        {MapComponent && !loading ? (
          <MapComponent members={members} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="font-body text-sm text-muted-foreground">Loading map...</p>
          </div>
        )}
      </motion.div>

      {/* Country breakdown */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Members by Market</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(countryGroups).sort((a, b) => b[1].length - a[1].length).map(([country, members]) => (
            <div key={country} className="bg-card border border-border rounded-xl p-4 hover:border-gold/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-body text-sm font-medium text-foreground">{country}</h4>
                <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-[10px]">
                  <Users className="w-3 h-3 mr-1" />{members.length}
                </Badge>
              </div>
              <div className="space-y-1">
                {members.slice(0, 3).map((m, i) => (
                  <p key={i} className="font-body text-xs text-muted-foreground truncate">
                    {m.full_name}{m.city ? ` · ${m.city}` : ""}
                  </p>
                ))}
                {members.length > 3 && <p className="font-body text-[10px] text-muted-foreground/60">+{members.length - 3} more</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalMap;
