import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Globe, Handshake, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import trnLogo from "@/assets/trn-logo.png";
import loginBg from "@/assets/login-bg.jpg";

const pillars = [
  { icon: Globe, label: "Global Reach", desc: "Members across 50+ markets" },
  { icon: Handshake, label: "Trusted Referrals", desc: "Vetted agent-to-agent deals" },
  { icon: TrendingUp, label: "Real Deals", desc: "Active investment pipeline" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (session) navigate("/dashboard", { replace: true });
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else if (data.user?.user_metadata?.force_password_reset) {
      navigate("/reset-password?welcome=true");
    } else {
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?welcome=false`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "Password reset link has been sent." });
      setIsForgotPassword(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Gold top accent line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent z-50" />

      {/* LEFT PANEL — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        {/* Dark navy overlay for readability */}
        <div className="absolute inset-0 bg-[hsl(220,40%,8%)]/80" />
        {/* Animated grid over image */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--gold)/0.04)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--gold)/0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full bg-navy/40 blur-2xl pointer-events-none"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, delay: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex items-center gap-3"
        >
          <img src={trnLogo} alt="TRN" className="h-10 w-10 object-contain" />
          <div>
            <p className="font-display text-base font-bold text-white tracking-wide leading-tight">THE REALTY NETWORK</p>
            <p className="font-body text-[10px] text-gold/70 uppercase tracking-[0.35em]">Private Member Portal</p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10"
        >
          <p className="font-body text-xs text-gold uppercase tracking-[0.4em] mb-5">Member HQ</p>
          <h1 className="font-display text-5xl xl:text-6xl font-bold text-white leading-[0.95] mb-6">
            Where Elite<br />
            <span className="text-gold italic">Agents Connect.</span>
          </h1>
          <div className="w-16 h-[1px] bg-gold/40 mb-8" />
          <p className="font-body text-base text-white/50 leading-relaxed max-w-sm">
            Cross-border referrals, deal intelligence, and a vetted global network — built exclusively for top-tier real estate professionals.
          </p>

          {/* Pillars */}
          <div className="mt-12 space-y-4">
            {pillars.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-white/80">{label}</p>
                  <p className="font-body text-xs text-white/35">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="relative z-10"
        >
          <div className="border-l-2 border-gold/30 pl-4">
            <p className="font-display text-sm italic text-white/40 leading-relaxed">
              "The right connection is worth more than any marketing budget."
            </p>
            <p className="font-body text-xs text-gold/40 mt-2 uppercase tracking-widest">Jake Engerer — Founder, TRN</p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-background relative overflow-hidden px-6 py-16">
        {/* Subtle grid on form side too */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--gold)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--gold)/0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-10">
            <img src={trnLogo} alt="TRN" className="h-16 w-16 object-contain mx-auto mb-4" />
            <p className="font-display text-2xl font-bold text-foreground tracking-wide mb-1">THE REALTY NETWORK</p>
            <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-2" />
            <p className="font-body text-xs text-gold/70 uppercase tracking-[0.3em]">Private Member Portal</p>
          </div>

          {/* Form heading */}
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              {isForgotPassword ? "Reset Password" : "Member Sign In"}
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              {isForgotPassword ? "Enter your email to receive a reset link." : "Access your private network dashboard."}
            </p>
          </div>

          {/* Form card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="font-body h-12 rounded-lg focus:border-gold/40 focus:ring-gold/20"
                  placeholder="you@example.com"
                />
              </div>

              {!isForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="font-body pr-10 h-12 rounded-lg focus:border-gold/40 focus:ring-gold/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold h-12 rounded-lg text-base transition-all hover:shadow-[0_0_30px_hsl(var(--gold)/0.25)]"
              >
                {isLoading ? "Please wait..." : isForgotPassword ? "Send Reset Link" : "Sign In"}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </form>

            <button
              onClick={() => setIsForgotPassword(!isForgotPassword)}
              className="mt-5 text-sm font-body text-muted-foreground hover:text-gold transition-colors w-full text-center"
            >
              {isForgotPassword ? "Back to sign in" : "Forgot password?"}
            </button>
          </div>

          <p className="text-center mt-6 font-body text-xs text-muted-foreground/50 tracking-wide">
            Invite-only access · Contact your admin for an invitation
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
