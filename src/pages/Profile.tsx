import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rawProfile, setRawProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [form, setForm] = useState({
    full_name: "", title: "", city: "", country: "", agency: "", role: "Agent",
    instagram: "", linkedin_url: "", website_url: "", bio: "",
    can_help_with: "", looking_for: "", years_experience: "",
    niche: "" as string, languages: "" as string,
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setRawProfile(data);
        setAvatarUrl(data.avatar_url || null);
        setForm({
          full_name: data.full_name || "", title: data.title || "",
          city: data.city || "", country: data.country || "",
          agency: data.agency || "", role: data.role || "Agent",
          instagram: data.instagram || "", linkedin_url: data.linkedin_url || "",
          website_url: data.website_url || "", bio: data.bio || "",
          can_help_with: data.can_help_with || "", looking_for: data.looking_for || "",
          years_experience: data.years_experience?.toString() || "",
          niche: (data.niche || []).join(", "),
          languages: (data.languages || []).join(", "),
        });
      }
      setLoading(false);
    });
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please choose an image under 2MB.", variant: "destructive" });
      return;
    }
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploadingAvatar(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
    if (updateError) {
      toast({ title: "Could not save avatar URL", description: updateError.message, variant: "destructive" });
    } else {
      setAvatarUrl(publicUrl);
      setRawProfile((prev: any) => prev ? { ...prev, avatar_url: publicUrl } : prev);
      toast({ title: "Profile photo updated" });
    }
    setUploadingAvatar(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name, title: form.title || null,
      city: form.city, country: form.country,
      agency: form.agency, role: form.role,
      instagram: form.instagram || null,
      linkedin_url: form.linkedin_url || null,
      website_url: form.website_url || null,
      bio: form.bio || null,
      can_help_with: form.can_help_with,
      looking_for: form.looking_for,
      years_experience: form.years_experience ? Number(form.years_experience) : null,
      niche: form.niche.split(",").map((s) => s.trim()).filter(Boolean),
      languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
    }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>
    );
  }

  const completionFields = [
    form.full_name, form.city, form.country, form.agency, form.role,
    form.niche, form.languages, form.can_help_with, form.looking_for,
    form.bio, avatarUrl, form.instagram, form.linkedin_url,
  ];
  const completedFields = completionFields.filter(Boolean).length;
  const totalFields = completionFields.length;
  const completion = Math.round((completedFields / totalFields) * 100);
  const remaining = totalFields - completedFields;

  const initials = (form.full_name || "TRN")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Your Profile</h2>
        <p className="font-body text-sm text-muted-foreground">A strong profile attracts more introductions and referrals</p>
      </div>

      {/* Completion bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-body text-xs text-muted-foreground">Profile completeness</span>
            {remaining > 0 && (
              <span className="font-body text-xs text-gold ml-2">· {remaining} field{remaining !== 1 ? "s" : ""} remaining</span>
            )}
          </div>
          <span className={`font-body text-xs font-medium ${completion === 100 ? "text-emerald-400" : "text-gold"}`}>{completion}%</span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${completion === 100 ? "bg-emerald-400" : "bg-gold"}`}
            style={{ width: `${completion}%` }}
          />
        </div>
        {completion === 100 && (
          <p className="font-body text-[10px] text-emerald-400 mt-1.5">Profile complete — you're getting maximum visibility</p>
        )}
      </motion.div>

      {/* Avatar upload */}
      <div className="flex items-center gap-5 bg-card border border-border rounded-xl p-5">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback className="bg-gold/10 text-gold font-display text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {uploadingAvatar && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div>
          <p className="font-body text-sm font-medium text-foreground mb-0.5">Profile Photo</p>
          <p className="font-body text-xs text-muted-foreground mb-3">JPG or PNG · max 2MB</p>
          <Button
            variant="outline"
            size="sm"
            className="border-gold/30 text-gold hover:bg-gold/10 font-body text-xs"
            onClick={() => document.getElementById("avatar-upload")?.click()}
            disabled={uploadingAvatar}
            type="button"
          >
            <Camera className="w-3.5 h-3.5 mr-1.5" />
            {uploadingAvatar ? "Uploading..." : "Change Photo"}
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h3 className="font-display text-base font-semibold text-foreground">Basic Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label className="font-body text-xs text-muted-foreground">Full Name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
          <div><Label className="font-body text-xs text-muted-foreground">Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="Director, CEO, Partner..." /></div>
          <div><Label className="font-body text-xs text-muted-foreground">Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="Agent, Broker, Investor..." /></div>
          <div><Label className="font-body text-xs text-muted-foreground">Agency / Company *</Label><Input value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
          <div><Label className="font-body text-xs text-muted-foreground">City *</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
          <div><Label className="font-body text-xs text-muted-foreground">Country *</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
          <div><Label className="font-body text-xs text-muted-foreground">Years in Business</Label><Input type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} className="bg-background border-border text-foreground font-body" /></div>
        </div>

        <h3 className="font-display text-base font-semibold text-foreground pt-4 border-t border-border">About You</h3>
        <div><Label className="font-body text-xs text-muted-foreground">Bio / Credibility Summary *</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[80px]" placeholder="Brief professional summary — what sets you apart in the market" /></div>
        <div><Label className="font-body text-xs text-muted-foreground">Specialties / Deal Types *</Label><Input value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="Luxury Sales, Commercial, Investment, Development..." /></div>
        <div><Label className="font-body text-xs text-muted-foreground">Languages</Label><Input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="English, Spanish, French..." /></div>

        <h3 className="font-display text-base font-semibold text-foreground pt-4 border-t border-border">Network Value</h3>
        <div><Label className="font-body text-xs text-muted-foreground">What can you help other members with? *</Label><Textarea value={form.can_help_with} onChange={(e) => setForm({ ...form, can_help_with: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[60px]" placeholder="Buyer referrals in Dubai, off-market luxury listings, investor introductions..." /></div>
        <div><Label className="font-body text-xs text-muted-foreground">What are you looking for? *</Label><Textarea value={form.looking_for} onChange={(e) => setForm({ ...form, looking_for: e.target.value })} className="bg-background border-border text-foreground font-body min-h-[60px]" placeholder="Partners in London, international investors, development opportunities..." /></div>

        <h3 className="font-display text-base font-semibold text-foreground pt-4 border-t border-border">Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label className="font-body text-xs text-muted-foreground">LinkedIn</Label><Input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="https://linkedin.com/in/..." /></div>
          <div><Label className="font-body text-xs text-muted-foreground">Website</Label><Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="https://..." /></div>
          <div><Label className="font-body text-xs text-muted-foreground">Instagram</Label><Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="bg-background border-border text-foreground font-body" placeholder="@handle" /></div>
        </div>

        <Button type="submit" disabled={saving} className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-body font-semibold">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
