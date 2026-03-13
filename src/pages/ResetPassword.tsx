import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can now sign in." });
      navigate("/login");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Globe className="w-8 h-8 text-gold mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-[hsl(220,15%,90%)]">Set New Password</h1>
        </div>
        <div className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="font-body text-[hsl(220,10%,55%)]">New Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-[hsl(220,25%,7%)] border-[hsl(220,20%,18%)] text-[hsl(220,15%,85%)] font-body"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold">
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
