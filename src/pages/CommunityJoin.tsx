import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import trnLogo from "@/assets/trn-logo.png";
import loginBg from "@/assets/login-bg.jpg";

const FREE_WHATSAPP = "https://chat.whatsapp.com/Gm1sPJ7B0NcF1HrjXuukXx";
const GHL_WEBHOOK = "https://n8n.therealty-network.com/webhook/trn-new-application";

const CommunityJoin = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    whatsapp: "",
    email: "",
    country: "",
    city: "",
    role: "",
    instagram: "",
    linkedin: "",
    how_did_you_hear: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim() || null,
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim() || null,
      country: form.country.trim(),
      city: form.city.trim() || null,
      role: form.role || null,
      instagram: form.instagram.trim() || null,
      linkedin: form.linkedin.trim() || null,
      how_did_you_hear: form.how_did_you_hear.trim() || null,
      form_submitted_at: new Date().toISOString(),
    };

    // Check for existing record by whatsapp or email before inserting
    const orFilter = [
      `whatsapp.eq.${payload.whatsapp}`,
      ...(payload.email ? [`email.eq.${payload.email}`] : []),
    ].join(",");
    const { data: existing } = await supabase
      .from("community_members")
      .select("id")
      .or(orFilter)
      .limit(1);

    if (existing && existing.length > 0) {
      // Already registered — skip insert and go straight to success
      setSubmitted(true);
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("community_members").insert(payload);

    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Fire GHL / n8n webhook — non-blocking, errors don't block the user
    try {
      await fetch(GHL_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source: "trn_community_join_form" }),
      });
    } catch {
      // Webhook failure is silent — Supabase record already saved
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  if (submitted) {
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${loginBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 w-full max-w-md px-6 text-center">
          <img src={trnLogo} alt="TRN" className="h-20 w-20 object-contain mx-auto mb-6 drop-shadow-2xl" />
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-white mb-3">You're In!</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mb-4" />
            <p className="font-body text-sm text-white/70 mb-8 leading-relaxed">
              Welcome to The Realty Network free community. Click below to join the WhatsApp group and start connecting with agents worldwide.
            </p>
            <Button
              className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold h-12 rounded-lg text-base transition-all hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)]"
              asChild
            >
              <a href={FREE_WHATSAPP} target="_blank" rel="noopener noreferrer">
                Join WhatsApp Community <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <p className="mt-6 font-body text-xs text-white/30">
              Already a paid member?{" "}
              <a href="/login" className="text-gold hover:text-gold-light transition-colors">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-12">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${loginBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={trnLogo} alt="The Realty Network" className="h-20 w-20 object-contain mx-auto mb-5 drop-shadow-2xl" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-wide mb-2">
            Join The Network
          </h1>
          <div className="w-16 h-[1px] bg-gold/50 mx-auto mb-3" />
          <p className="font-body text-sm text-gold uppercase tracking-[0.3em]">Free Community Access</p>
          <p className="font-body text-sm text-white/50 mt-3 max-w-sm mx-auto">
            Connect with global real estate agents. Free to join — no credit card required.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-white/50 uppercase tracking-wider">First Name *</Label>
                <Input
                  value={form.first_name}
                  onChange={set("first_name")}
                  required
                  placeholder="Jane"
                  className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40 placeholder:text-white/25"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-white/50 uppercase tracking-wider">Last Name</Label>
                <Input
                  value={form.last_name}
                  onChange={set("last_name")}
                  placeholder="Smith"
                  className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40 placeholder:text-white/25"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <Label className="font-body text-xs text-white/50 uppercase tracking-wider">WhatsApp Number *</Label>
              <Input
                value={form.whatsapp}
                onChange={set("whatsapp")}
                required
                placeholder="+44 7700 000000"
                className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40 placeholder:text-white/25"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="font-body text-xs text-white/50 uppercase tracking-wider">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="jane@agency.com"
                className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40 placeholder:text-white/25"
              />
            </div>

            {/* Country / City */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-white/50 uppercase tracking-wider">Country *</Label>
                <Input
                  value={form.country}
                  onChange={set("country")}
                  required
                  placeholder="United Kingdom"
                  className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40 placeholder:text-white/25"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-white/50 uppercase tracking-wider">City</Label>
                <Input
                  value={form.city}
                  onChange={set("city")}
                  placeholder="London"
                  className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40 placeholder:text-white/25"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label className="font-body text-xs text-white/50 uppercase tracking-wider">Your Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40">
                  <SelectValue placeholder="Select your role..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["Agent", "Broker", "Investor", "Developer", "Founder", "Other"].map((r) => (
                    <SelectItem key={r} value={r} className="font-body">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Instagram / LinkedIn */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-white/50 uppercase tracking-wider">Instagram</Label>
                <Input
                  value={form.instagram}
                  onChange={set("instagram")}
                  placeholder="@yourhandle"
                  className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40 placeholder:text-white/25"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-white/50 uppercase tracking-wider">LinkedIn</Label>
                <Input
                  value={form.linkedin}
                  onChange={set("linkedin")}
                  placeholder="linkedin.com/in/..."
                  className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40 placeholder:text-white/25"
                />
              </div>
            </div>

            {/* How did you hear */}
            <div className="space-y-1.5">
              <Label className="font-body text-xs text-white/50 uppercase tracking-wider">How did you hear about us?</Label>
              <Input
                value={form.how_did_you_hear}
                onChange={set("how_did_you_hear")}
                placeholder="Instagram, referral, event..."
                className="bg-white/5 border-white/10 text-white font-body h-11 rounded-lg focus:border-gold/40 placeholder:text-white/25"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold h-12 rounded-lg text-base transition-all hover:shadow-[0_0_30px_hsl(var(--gold)/0.25)] mt-2"
            >
              {submitting ? "Submitting..." : "Join The Free Community"}
              {!submitting && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          <p className="mt-5 text-center font-body text-xs text-white/30">
            Already a paid member?{" "}
            <a href="/login" className="text-gold hover:text-gold-light transition-colors">
              Sign in here
            </a>
          </p>
        </div>

        <p className="text-center mt-6 font-body text-xs text-white/20 tracking-wide">
          Free community · No spam · Unsubscribe any time
        </p>
      </div>
    </div>
  );
};

export default CommunityJoin;
