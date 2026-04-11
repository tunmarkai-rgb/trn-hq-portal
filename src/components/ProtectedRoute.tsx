import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Globe } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Globe className="w-10 h-10 text-gold animate-spin" />
          <p className="font-body text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.user?.user_metadata?.force_password_reset) {
    return <Navigate to="/reset-password?welcome=true" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
