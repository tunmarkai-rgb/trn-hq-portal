import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, Users, Handshake, Building2, CalendarDays, BookOpen, Settings, LogOut, Globe, TrendingUp, MessageCircle, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import trnLogo from "@/assets/trn-logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
  { icon: Users, label: "Directory", path: "/dashboard/directory" },
  { icon: Globe, label: "Global Map", path: "/dashboard/map" },
  { icon: TrendingUp, label: "Opportunities", path: "/dashboard/opportunities" },
  { icon: Handshake, label: "Referrals", path: "/dashboard/referrals" },
  { icon: Building2, label: "Deals", path: "/dashboard/deals" },
  { icon: CalendarDays, label: "Events", path: "/dashboard/events" },
  { icon: BookOpen, label: "Knowledge", path: "/dashboard/knowledge" },
  { icon: MessageCircle, label: "Community", path: "/dashboard/community" },
  { icon: Briefcase, label: "Resources", path: "/dashboard/resources" },
  { icon: Settings, label: "Profile", path: "/dashboard/profile" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-card border-r border-border transform transition-transform duration-200 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
        <div className="flex items-center gap-3 px-5 h-14 border-b border-border shrink-0">
          <img src={trnLogo} alt="TRN" className="h-6 w-6 object-contain" />
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold text-foreground tracking-wide leading-tight">TRN HQ</span>
            <span className="font-body text-[8px] text-gold/60 uppercase tracking-[0.2em]">Member Portal</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-[13px] transition-all duration-200 ${
                  isActive
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border shrink-0">
          <button
            onClick={signOut}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-[13px] text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border flex items-center px-6 bg-card/80 backdrop-blur-xl sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-muted-foreground mr-4">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">
            {navItems.find((n) => n.path === location.pathname)?.label || "Dashboard"}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
