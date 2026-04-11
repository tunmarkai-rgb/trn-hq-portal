import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import trnLogo from "@/assets/trn-logo.png";
import loginBg from "@/assets/login-bg.jpg";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Detect if this is a first-login flow (n8n sets ?welcome=true on the reset link)
  const isWelcome = new URLSearchParams(window.location.search).get("welcome") === "true";

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both fields are identical.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password, data: { force_password_reset: false } });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password set", description: "You're all set — signing you in now." });
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${loginBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <img src={trnLogo} alt="The Realty Network" className="h-20 w-20 object-contain mx-auto mb-5 drop-shadow-2xl" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-wide mb-2">
            {isWelcome ? "Welcome to TRN" : "Set New Password"}
          </h1>
          <div className="w-16 h-[1px] bg-gold/50 mx-auto mb-3" />
          <p className="font-body text-sm text-gold uppercase tracking-[0.3em]">
            {isWelcome ? "Member HQ" : "Password Reset"}
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {isWelcome && (
            <div className="mb-6 p-4 rounded-xl bg-gold/10 border border-gold/20">
              <p className="font-body text-sm text-gold font-medium">Your account is ready.</p>
              <p className="font-body text-xs text-white/60 mt-1 leading-relaxed">
                Please set a permanent password to secure your access to TRN HQ.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-body text-xs text-white/50 uppercase tracking-wider">
                {isWelcome ? "Create Password" : "New Password"}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-white/5 border-white/10 text-white font-body pr-10 h-12 rounded-lg focus:border-gold/40 focus:ring-gold/20 placeholder:text-white/25"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-xs text-white/50 uppercase tracking-wider">Confirm Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="bg-white/5 border-white/10 text-white font-body h-12 rounded-lg focus:border-gold/40 focus:ring-gold/20 placeholder:text-white/25"
                placeholder="Repeat your password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold h-12 rounded-lg text-base transition-all hover:shadow-[0_0_30px_hsl(var(--gold)/0.25)] mt-2"
            >
              {isLoading ? "Please wait..." : isWelcome ? "Activate My Account" : "Update Password"}
              {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
