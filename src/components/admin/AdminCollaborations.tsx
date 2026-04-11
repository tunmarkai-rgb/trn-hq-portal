import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { format } from "date-fns";

interface Props {
  data: any[];
  profiles: Record<string, string>;
  listings: Record<string, string>;
  onRefresh: () => void;
}

const statusColors: Record<string, string> = {
  submitted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "under review": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  declined: "bg-red-500/10 text-red-400 border-red-500/20",
  connected: "bg-gold/10 text-gold border-gold/20",
};

const AdminCollaborations = ({ data, profiles, listings, onRefresh }: Props) => {
  const { toast } = useToast();

  const handleAction = async (id: string, status: string) => {
    await (supabase.from("collaboration_requests" as any).update({ status }) as any).eq("id", id);
    toast({ title: `Request ${status}` });
    onRefresh();
  };

  const isPending = (status: string) =>
    status === "submitted" || status === "under review" || status === "pending";

  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <p className="text-center py-12 font-body text-muted-foreground">No collaboration requests yet.</p>
      ) : data.map((c) => (
        <div key={c.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm font-medium text-foreground">
                {profiles[c.requester_id] || "Member"}
              </p>
              {listings[c.listing_id] && (
                <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                  Re: <span className="text-foreground">{listings[c.listing_id]}</span>
                </p>
              )}
            </div>
            <Badge variant="secondary" className={`font-body text-[10px] ${statusColors[c.status] || ""}`}>
              {c.status}
            </Badge>
          </div>
          {c.reason && <p className="font-body text-xs text-muted-foreground italic">"{c.reason}"</p>}
          {c.what_they_bring && <p className="font-body text-[11px] text-muted-foreground"><span className="text-foreground/60">Brings:</span> {c.what_they_bring}</p>}
          {c.market_relevance && <p className="font-body text-[11px] text-muted-foreground"><span className="text-foreground/60">Market fit:</span> {c.market_relevance}</p>}
          <div className="flex items-center gap-2 pt-1">
            <span className="font-body text-[10px] text-muted-foreground">{format(new Date(c.created_at), "MMM d, yyyy")}</span>
            {isPending(c.status) && (
              <>
                <Button size="sm" onClick={() => handleAction(c.id, "accepted")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-body text-xs h-7 ml-auto">
                  <Check className="w-3 h-3 mr-1" /> Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAction(c.id, "declined")} className="border-border text-muted-foreground font-body text-xs h-7">
                  <X className="w-3 h-3 mr-1" /> Decline
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCollaborations;
