import { useEffect, useState } from "react";
import { Briefcase, ExternalLink, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const categoryColors: Record<string, string> = {
  "Currency Exchange": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Tax & Immigration": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Wealth Management": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Legal: "bg-gold/10 text-gold border-gold/20",
  "Franchise Partner": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Market Data": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const Partners = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("partners").select("*").order("category");
      setPartners(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="text-center py-12 font-body text-muted-foreground">Loading partners...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Vetted Partners</h2>
        <p className="font-body text-sm text-muted-foreground">Trusted service providers for international real estate professionals</p>
      </div>

      {partners.length === 0 ? (
        <div className="text-center py-16 font-body text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Partner directory coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-gold/20 transition-all duration-300 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{p.name}</h3>
                  <Badge className={`${categoryColors[p.category] || "bg-secondary text-muted-foreground"} font-body text-[10px] mt-1`}>
                    {p.category}
                  </Badge>
                </div>
              </div>

              {p.description && (
                <p className="font-body text-sm text-muted-foreground">{p.description}</p>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                {p.website && (
                  <a href={p.website} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="border-border text-muted-foreground hover:text-foreground font-body text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" /> Website
                    </Button>
                  </a>
                )}
                <Button size="sm" variant="outline" className="border-gold/20 text-gold hover:bg-gold/10 font-body text-xs">
                  <ArrowLeftRight className="w-3 h-3 mr-1" /> Request Intro
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Partners;
