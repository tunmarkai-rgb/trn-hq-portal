import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Directory from "./pages/Directory";
import Deals from "./pages/Deals";
import Referrals from "./pages/Referrals";
import Calendar from "./pages/Calendar";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/directory" element={<ProtectedRoute><DashboardLayout><Directory /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/deals" element={<ProtectedRoute><DashboardLayout><Deals /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/referrals" element={<ProtectedRoute><DashboardLayout><Referrals /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/calendar" element={<ProtectedRoute><DashboardLayout><Calendar /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/resources" element={<ProtectedRoute><DashboardLayout><Resources /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
