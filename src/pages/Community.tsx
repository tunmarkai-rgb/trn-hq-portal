import { useEffect, useState } from "react";
import { MessageCircle, ExternalLink, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const channelIcons: Record<string, React.ReactNode> = {
  WhatsApp: <MessageCircle className="w-5 h-5" />,
  LinkedIn: <Linkedin className="w-5 h-5" />,
  YouTube: <Youtube className="w-5 h-5" />,
};

const channelColors: Record<string, string> = {
  WhatsApp: "bg-green-500/10 text-green-400 border-green-500/20",
  LinkedIn: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  YouTube: "bg-red-500/10 text-red-400 border-red-500/20",
};

const Community = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("community_links").select("*").order("created_at");
      setLinks(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="text-center py-12 font-body text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Community</h2>
        <p className="font-body text-sm text-muted-foreground">Connect with TRN members across our active channels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link, i) => (
          <motion.div key={link.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card border border-border rounded-2xl p-6 hover:border-gold/20 transition-all duration-300 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${channelColors[link.channel_type] || "bg-secondary text-muted-foreground"}`}>
                {channelIcons[link.channel_type] || <MessageCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-semibold text-foreground">{link.label}</h3>
                <p className="font-body text-xs text-muted-foreground/70 uppercase tracking-wider">{link.channel_type}</p>
              </div>
            </div>
            {link.description && <p className="font-body text-sm text-muted-foreground">{link.description}</p>}
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="border-gold/20 text-gold hover:bg-gold/10 font-body text-xs">
                <ExternalLink className="w-3 h-3 mr-1" /> Join Channel
              </Button>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Community;
