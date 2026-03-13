import { CalendarDays, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Calendar = () => {
  // Calendar data will be pulled from Notion's Community Calendar via edge function
  // For now, show a placeholder with instructions
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[hsl(220,15%,90%)]">Community Calendar</h2>
        <p className="font-body text-sm text-[hsl(220,10%,50%)]">Upcoming calls, masterminds, and events</p>
      </div>

      <div className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-8 text-center">
        <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gold" />
        <h3 className="font-display text-lg font-semibold text-[hsl(220,15%,85%)] mb-2">Coming Soon</h3>
        <p className="font-body text-sm text-[hsl(220,10%,50%)] max-w-md mx-auto">
          The community calendar will sync directly from Notion. Stay tuned for upcoming masterminds and networking events.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["Community Call", "Training Session", "Masterclass", "Networking Event", "Q&A Session"].map((type) => (
            <Badge key={type} variant="secondary" className="bg-gold/10 text-gold border-gold/20 font-body text-xs">
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
