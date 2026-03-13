import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, Menu, X, LayoutDashboard, Users, Handshake, Building2, CalendarDays, BookOpen, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Directory", path: "/dashboard/directory" },
  { icon: Handshake, label: "Referrals", path: "/dashboard/referrals" },
  { icon: Building2, label: "Deals", path: "/dashboard/deals" },
  { icon: CalendarDays, label: "Calendar", path: "/dashboard/calendar" },
  { icon: BookOpen, label: "Resources", path: "/dashboard/resources" },
  { icon: Settings, label: "Profile", path: "/dashboard/profile" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(220,25%,10%)] border-r border-[hsl(220,20%,18%)] transform transition-transform duration-200 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-2 px-6 h-16 border-b border-[hsl(220,20%,18%)]">
          <Globe className="w-5 h-5 text-gold" />
          <span className="font-display text-base font-bold text-[hsl(220,15%,85%)]">TRN HQ</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-[hsl(220,10%,55%)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-[hsl(220,10%,55%)] hover:text-[hsl(220,10%,75%)] hover:bg-[hsl(220,25%,13%)]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[hsl(220,20%,18%)]">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-[hsl(220,10%,45%)] hover:text-red-400 hover:bg-red-400/5 transition-colors w-full"
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
        <header className="h-16 border-b border-[hsl(220,20%,18%)] flex items-center px-6 bg-[hsl(220,25%,10%)]/50 backdrop-blur-sm sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-[hsl(220,10%,55%)] mr-4">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-[hsl(220,15%,85%)]">
            {navItems.find((n) => n.path === location.pathname)?.label || "Dashboard"}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
