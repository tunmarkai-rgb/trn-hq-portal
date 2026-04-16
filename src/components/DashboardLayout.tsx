import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, Users, Handshake, Globe, CalendarDays, Settings, LogOut, TrendingUp, Briefcase, ArrowLeftRight, Shield, Building2, Play, FileText, BookOpen, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import trnLogo from "@/assets/trn-logo.png";

const navGroups = [
  {
    label: "Network",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Users, label: "Members", path: "/dashboard/directory" },
      { icon: Globe, label: "Network Map", path: "/dashboard/map" },
    ],
  },
  {
    label: "Deal Flow",
    items: [
      { icon: TrendingUp, label: "Opportunities", path: "/dashboard/opportunities" },
      { icon: Building2, label: "Investments", path: "/dashboard/investments" },
      { icon: ArrowLeftRight, label: "Introductions", path: "/dashboard/introductions" },
      { icon: Handshake, label: "My Deals", path: "/dashboard/deals" },
    ],
  },
  {
    label: "Community",
    items: [
      { icon: CalendarDays, label: "Calls & Events", path: "/dashboard/events" },
      { icon: Briefcase, label: "Partners", path: "/dashboard/partners" },
      { icon: BookOpen, label: "Education Hub", path: "/dashboard/education" },
      { icon: Play, label: "Video Library", path: "/dashboard/videos" },
      { icon: FileText, label: "Referral Templates", path: "/dashboard/referral-templates" },
    ],
  },
];

// Flat list for page title lookup
const allNavItems = [
  ...navGroups.flatMap((g) => g.items),
  { label: "My Profile", path: "/dashboard/profile" },
  { label: "Admin", path: "/dashboard/admin" },
  { label: "SOP Library", path: "/dashboard/sop" },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; role: string | null; avatar_url: string | null } | null>(null);
  const location = useLocation();
  const { signOut, user } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
    });
    supabase
      .from("profiles")
      .select("full_name, role, avatar_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "";
  const initials = (profile?.full_name ?? "TRN")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const pageTitle = allNavItems.find((n) => n.path === location.pathname)?.label ?? "Dashboard";
  const greeting = getGreeting();

  const NavLink = ({ icon: Icon, label, path }: { icon: React.ElementType; label: string; path: string }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-2.5 py-2.5 rounded-lg font-body text-[13px] transition-all duration-150 ${
          isActive
            ? "border-l-2 border-gold bg-gold/8 text-gold pl-[10px] pr-3"
            : "pl-3 pr-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-gold" : ""}`} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-card border-r border-border transform transition-transform duration-200 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col relative`}>
        {/* Gold right-edge accent */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/15 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
          <img src={trnLogo} alt="TRN" className="h-7 w-7 object-contain" />
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold text-foreground tracking-wide leading-tight">TRN HQ</span>
            <span className="font-body text-[7px] text-gold/50 uppercase tracking-[0.25em]">Private Network</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation groups */}
        <nav className="p-3 flex-1 overflow-y-auto space-y-0">
          {navGroups.map((group, gi) => (
            <div key={group.label}>
              <p className={`font-body text-[9px] text-muted-foreground/40 uppercase tracking-[0.3em] px-3 pb-1 ${gi === 0 ? "pt-2" : "pt-4"}`}>
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink key={item.path} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-border shrink-0 space-y-0.5">
          {isAdmin && (
            <>
              <p className="font-body text-[9px] text-muted-foreground/40 uppercase tracking-[0.3em] px-3 pt-2 pb-1">
                Admin
              </p>
              <NavLink icon={Shield} label="Admin" path="/dashboard/admin" />
              <NavLink icon={ClipboardList} label="SOP Library" path="/dashboard/sop" />
            </>
          )}
          <NavLink icon={Settings} label="My Profile" path="/dashboard/profile" />

          {/* User avatar row */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-lg border border-border/50 bg-secondary/20">
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-gold/20 text-gold text-[10px] font-display font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-body text-[12px] font-medium text-foreground truncate leading-tight">
                {profile?.full_name ?? "Member"}
              </p>
              <p className="font-body text-[9px] text-muted-foreground truncate">
                {profile?.role ?? "Agent"}
              </p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="flex items-center gap-2.5 pl-3 py-2.5 rounded-lg font-body text-[13px] text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors w-full"
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
        <header className="min-h-14 border-b border-border flex items-center px-4 sm:px-6 bg-card/80 backdrop-blur-xl sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-muted-foreground mr-4 shrink-0">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
            <h1 className="font-display text-sm font-semibold text-foreground leading-tight truncate">{pageTitle}</h1>
            {firstName && (
              <p className="font-body text-[10px] text-muted-foreground leading-tight truncate">
                {greeting}, {firstName}<span className="hidden sm:inline"> · {format(new Date(), "EEEE, d MMMM")}</span>
              </p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
