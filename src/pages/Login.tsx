import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import trnLogo from "@/assets/trn-logo.png";

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
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
    <div className="min-h-screen bg-navy flex items-center justify-center relative overflow-hidden px-4">
      {/* Subtle background pattern — low-opacity grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--gold) / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold) / 0.6) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Subtle radial glow behind form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.03] blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & brand */}
        <div className="text-center mb-10">
          <img src={trnLogo} alt="The Realty Network" className="h-16 w-16 object-contain mx-auto mb-5 opacity-90" />
          <h1 className="font-display text-3xl font-bold text-[hsl(220,15%,92%)] tracking-wide mb-1">
            The Realty Network
          </h1>
          <p className="font-body text-sm text-[hsl(220,10%,50%)]">Member Headquarters</p>
        </div>

        {/* Form card */}
        <div className="bg-[hsl(220,25%,9%)] border border-gold/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <h2 className="font-display text-xl font-semibold text-[hsl(220,15%,88%)] mb-6">
            {isForgotPassword ? "Reset Password" : "Sign In"}
          </h2>

          <form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-xs text-[hsl(220,10%,55%)] uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,16%)] text-[hsl(220,15%,85%)] font-body h-12 rounded-lg focus:border-gold/40 focus:ring-gold/20"
                placeholder="you@example.com"
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body text-xs text-[hsl(220,10%,55%)] uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,16%)] text-[hsl(220,15%,85%)] font-body pr-10 h-12 rounded-lg focus:border-gold/40 focus:ring-gold/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,40%)] hover:text-gold transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold h-12 rounded-lg text-base transition-all hover:shadow-[0_0_30px_hsl(var(--gold)/0.2)]"
            >
              {isLoading ? "Please wait..." : isForgotPassword ? "Send Reset Link" : "Sign In"}
              {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          <button
            onClick={() => setIsForgotPassword(!isForgotPassword)}
            className="mt-5 text-sm font-body text-[hsl(220,10%,45%)] hover:text-gold transition-colors w-full text-center"
          >
            {isForgotPassword ? "Back to sign in" : "Forgot password?"}
          </button>
        </div>

        <p className="text-center mt-8 font-body text-xs text-[hsl(220,10%,30%)] tracking-wide">
          Invite-only access · Contact your admin for an invitation
        </p>
      </div>
    </div>
  );
};

export default Login;
