import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  data: any[];
  onRefresh: () => void;
}

const eventTypes = ["Call", "Masterclass", "Training", "Community Call", "Guest Speaker", "Webinar"];
const timezones = ["UTC", "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles", "Asia/Dubai", "Asia/Singapore", "Australia/Sydney"];

const AdminEvents = ({ data, onRefresh }: Props) => {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [form, setForm] = useState({
    title: "", description: "", event_date: "", event_type: "Call",
    speaker: "", join_link: "", timezone: "UTC", target_audience: "all",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("events").insert({
      title: form.title,
      description: form.description || null,
      event_date: form.event_date,
      event_type: form.event_type,
      speaker: form.speaker || null,
      join_link: form.join_link || null,
      timezone: form.timezone,
      target_audience: form.target_audience,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event created" });
      setCreateOpen(false);
      setForm({ title: "", description: "", event_date: "", event_type: "Call", speaker: "", join_link: "", timezone: "UTC", target_audience: "all" });
      onRefresh();
    }
  };

  const handleEditSave = async () => {
    if (!editEvent) return;
    const { error } = await supabase.from("events").update({
      title: editEvent.title,
      description: editEvent.description || null,
      event_date: editEvent.event_date,
      event_type: editEvent.event_type,
      speaker: editEvent.speaker || null,
      join_link: editEvent.join_link || null,
      summary: editEvent.summary || null,
      recording_url: editEvent.recording_url || null,
    }).eq("id", editEvent.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event updated" });
      setEditOpen(false);
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event deleted" });
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)} className="bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Create Event
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="text-center py-12 font-body text-muted-foreground">No events yet.</p>
      ) : data.map((e) => (
        <div key={e.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-body text-sm font-medium text-foreground">{e.title}</p>
              <Badge variant="secondary" className="font-body text-[10px]">{e.event_type}</Badge>
            </div>
            <p className="font-body text-[11px] text-muted-foreground">
              {format(new Date(e.event_date), "MMM d, yyyy 'at' h:mm a")}
              {e.speaker ? ` · ${e.speaker}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setEditEvent({ ...e }); setEditOpen(true); }} className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(e.id)} className="text-muted-foreground hover:text-destructive h-8 w-8 p-0">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Create Event / Call</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div><Label className="font-body text-xs text-muted-foreground">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-background border-border text-foreground font-body" placeholder="Monthly TRN Mastermind Call" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-body text-xs text-muted-foreground">Type</Label>
                <Select value={form.event_type} onValueChange={(v) => setForm({ ...form, event_type: v })}>
                  <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {eventTypes.map((t) => <SelectItem key={t} value={t} className="font-body">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body text-xs text-muted-foreground">Timezone</Label>
                <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                  <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {timezones.map((t) => <SelectItem key={t} value={t} className="font-body">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label className="font-body text-xs text-muted-foreground">Date & Time *</Label><Input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required className="bg-background border-border text-foreground font-body" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Host / Speaker</Label><Input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="Jake Engerer" /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Meeting Link</Label><Input value={form.join_link} onChange={(e) => setForm({ ...form, join_link: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="https://zoom.us/j/..." /></div>
            <div><Label className="font-body text-xs text-muted-foreground">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[80px]" /></div>
            <div>
              <Label className="font-body text-xs text-muted-foreground">Target Audience</Label>
              <Select value={form.target_audience} onValueChange={(v) => setForm({ ...form, target_audience: v })}>
                <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="font-body">All Members</SelectItem>
                  <SelectItem value="admins" className="font-body">Admins Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">Create Event</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Edit Event</DialogTitle></DialogHeader>
          {editEvent && (
            <div className="space-y-4">
              <div><Label className="font-body text-xs text-muted-foreground">Title</Label><Input value={editEvent.title} onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Date & Time</Label><Input type="datetime-local" value={editEvent.event_date?.slice(0, 16)} onChange={(e) => setEditEvent({ ...editEvent, event_date: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Type</Label>
                  <Select value={editEvent.event_type} onValueChange={(v) => setEditEvent({ ...editEvent, event_type: v })}>
                    <SelectTrigger className="bg-background border-border text-foreground font-body"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {eventTypes.map((t) => <SelectItem key={t} value={t} className="font-body">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="font-body text-xs text-muted-foreground">Speaker</Label><Input value={editEvent.speaker || ""} onChange={(e) => setEditEvent({ ...editEvent, speaker: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              </div>
              <div><Label className="font-body text-xs text-muted-foreground">Join Link</Label><Input value={editEvent.join_link || ""} onChange={(e) => setEditEvent({ ...editEvent, join_link: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Description</Label><Textarea value={editEvent.description || ""} onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[60px]" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Summary (post-event)</Label><Textarea value={editEvent.summary || ""} onChange={(e) => setEditEvent({ ...editEvent, summary: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[60px]" /></div>
              <div><Label className="font-body text-xs text-muted-foreground">Recording URL</Label><Input value={editEvent.recording_url || ""} onChange={(e) => setEditEvent({ ...editEvent, recording_url: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
              <Button onClick={handleEditSave} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
