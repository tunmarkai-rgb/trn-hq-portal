import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-gold" />
            <h1 className="font-display text-3xl font-bold text-[hsl(220,15%,90%)]">
              The Realty Network
            </h1>
          </div>
          <p className="font-body text-[hsl(220,10%,50%)]">Member Headquarters</p>
        </div>

        <div className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-8">
          <h2 className="font-display text-xl font-semibold text-[hsl(220,15%,85%)] mb-6">
            {isForgotPassword ? "Reset Password" : "Sign In"}
          </h2>

          <form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-[hsl(220,10%,55%)]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body"
                placeholder="you@example.com"
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body text-[hsl(220,10%,55%)]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,40%)] hover:text-[hsl(220,10%,60%)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold"
            >
              {isLoading ? "Please wait..." : isForgotPassword ? "Send Reset Link" : "Sign In"}
              {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          <button
            onClick={() => setIsForgotPassword(!isForgotPassword)}
            className="mt-4 text-sm font-body text-gold hover:text-gold-light transition-colors w-full text-center"
          >
            {isForgotPassword ? "Back to sign in" : "Forgot password?"}
          </button>
        </div>

        <p className="text-center mt-6 font-body text-xs text-[hsl(220,10%,35%)]">
          Invite-only access. Contact your admin for an invitation.
        </p>
      </div>
    </div>
  );
};

export default Login;
