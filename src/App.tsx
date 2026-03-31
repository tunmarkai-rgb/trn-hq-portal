import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Directory from "./pages/Directory";
import MemberProfile from "./pages/MemberProfile";
import Deals from "./pages/Deals";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import GlobalMap from "./pages/GlobalMap";
import Opportunities from "./pages/Opportunities";
import Introductions from "./pages/Introductions";
import Partners from "./pages/Partners";
import Investments from "./pages/Investments";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute><DashboardLayout>{children}</DashboardLayout></ProtectedRoute>
);

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<DashboardRoute><Dashboard /></DashboardRoute>} />
            <Route path="/dashboard" element={<DashboardRoute><Dashboard /></DashboardRoute>} />
            <Route path="/dashboard/directory" element={<DashboardRoute><Directory /></DashboardRoute>} />
            <Route path="/dashboard/member/:userId" element={<DashboardRoute><MemberProfile /></DashboardRoute>} />
            <Route path="/dashboard/map" element={<DashboardRoute><GlobalMap /></DashboardRoute>} />
            <Route path="/dashboard/opportunities" element={<DashboardRoute><Opportunities /></DashboardRoute>} />
            <Route path="/dashboard/introductions" element={<DashboardRoute><Introductions /></DashboardRoute>} />
            <Route path="/dashboard/deals" element={<DashboardRoute><Deals /></DashboardRoute>} />
            <Route path="/dashboard/investments" element={<DashboardRoute><Investments /></DashboardRoute>} />
            <Route path="/dashboard/events" element={<DashboardRoute><Events /></DashboardRoute>} />
            <Route path="/dashboard/partners" element={<DashboardRoute><Partners /></DashboardRoute>} />
            <Route path="/dashboard/admin" element={<DashboardRoute><Admin /></DashboardRoute>} />
            <Route path="/dashboard/profile" element={<DashboardRoute><Profile /></DashboardRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
