import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    city: "",
    country: "",
    agency: "",
    role: "Agent",
    instagram: "",
    can_help_with: "",
    looking_for: "",
    niche: "" as string,
    languages: "" as string,
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setForm({
          full_name: data.full_name || "",
          city: data.city || "",
          country: data.country || "",
          agency: data.agency || "",
          role: data.role || "Agent",
          instagram: data.instagram || "",
          can_help_with: data.can_help_with || "",
          looking_for: data.looking_for || "",
          niche: (data.niche || []).join(", "),
          languages: (data.languages || []).join(", "),
        });
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      city: form.city,
      country: form.country,
      agency: form.agency,
      role: form.role,
      instagram: form.instagram,
      can_help_with: form.can_help_with,
      looking_for: form.looking_for,
      niche: form.niche.split(",").map((s) => s.trim()).filter(Boolean),
      languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
    }).eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-12 font-body text-[hsl(220,10%,50%)]">Loading...</div>;

  const fieldClass = "bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body";
  const labelClass = "font-body text-[hsl(220,10%,55%)]";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[hsl(220,15%,90%)]">Your Profile</h2>
        <p className="font-body text-sm text-[hsl(220,10%,50%)]">Complete your profile to get discovered by other members</p>
      </div>

      <form onSubmit={handleSave} className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label className={labelClass}>Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={fieldClass} /></div>
          <div><Label className={labelClass}>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={fieldClass} placeholder="Agent, Broker, Investor..." /></div>
          <div><Label className={labelClass}>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={fieldClass} /></div>
          <div><Label className={labelClass}>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={fieldClass} /></div>
          <div><Label className={labelClass}>Agency / Company</Label><Input value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })} className={fieldClass} /></div>
          <div><Label className={labelClass}>Instagram</Label><Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={fieldClass} placeholder="@handle" /></div>
        </div>
        <div><Label className={labelClass}>Niches (comma-separated)</Label><Input value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} className={fieldClass} placeholder="Sales, Luxury, Rentals, Commercial..." /></div>
        <div><Label className={labelClass}>Languages (comma-separated)</Label><Input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} className={fieldClass} placeholder="English, Spanish, French..." /></div>
        <div><Label className={labelClass}>Can Help With</Label><Input value={form.can_help_with} onChange={(e) => setForm({ ...form, can_help_with: e.target.value })} className={fieldClass} placeholder="What you can offer other members..." /></div>
        <div><Label className={labelClass}>Looking For</Label><Input value={form.looking_for} onChange={(e) => setForm({ ...form, looking_for: e.target.value })} className={fieldClass} placeholder="What kind of connections or opportunities..." /></div>
        <Button type="submit" disabled={saving} className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
