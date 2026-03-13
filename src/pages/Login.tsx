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
    <div className="min-h-screen bg-navy flex relative overflow-hidden">
      {/* Left side — logo only */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-navy">
        <div className="relative z-10">
          <img src={trnLogo} alt="TRN" className="h-32 w-32 object-contain opacity-80" />
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 lg:max-w-lg">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <img src={trnLogo} alt="TRN" className="h-10 w-10 object-contain lg:hidden" />
              <div>
                <h1 className="font-display text-2xl font-bold text-[hsl(220,15%,92%)] tracking-wide">
                  Member HQ
                </h1>
              </div>
            </div>
            <p className="font-body text-sm text-[hsl(220,10%,50%)]">Sign in to access your network</p>
          </div>

          <div className="bg-[hsl(220,25%,9%)] border border-gold/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
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
    </div>
  );
};

export default Login;
