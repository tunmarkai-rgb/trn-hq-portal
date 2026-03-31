import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  data: any[];
  profiles: Record<string, string>;
  onRefresh: () => void;
}

const AdminInvestments = ({ data, profiles, onRefresh }: Props) => {
  const { toast } = useToast();

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await (supabase.from("investment_listings" as any).update({ featured: !featured }) as any).eq("id", id);
    toast({ title: featured ? "Unfeatured" : "Featured" });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("investment_listings").delete().eq("id", id);
    toast({ title: "Listing removed" });
    onRefresh();
  };

  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <p className="text-center py-12 font-body text-muted-foreground">No investment listings yet.</p>
      ) : data.map((l) => (
        <div key={l.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-body text-sm font-medium text-foreground">{l.title}</p>
              {l.featured && <Badge className="bg-gold/20 text-gold border-gold/30 font-body text-[10px]">★ Featured</Badge>}
            </div>
            <p className="font-body text-[11px] text-muted-foreground">
              {l.investment_type} · {[l.city, l.country].filter(Boolean).join(", ")} · by {profiles[l.posted_by] || "Member"}
              {l.asking_price ? ` · ${l.asking_price}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => handleToggleFeatured(l.id, l.featured)} className={`font-body text-xs h-7 ${l.featured ? "border-gold/30 text-gold" : "border-border text-muted-foreground"}`}>
              {l.featured ? "★ Featured" : "Feature"}
            </Button>
            <Badge variant="secondary" className="font-body text-[10px]">{l.deal_status}</Badge>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(l.id)} className="text-muted-foreground hover:text-destructive h-8 w-8 p-0">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminInvestments;
