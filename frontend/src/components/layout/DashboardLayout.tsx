import { Outlet, Link, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, FileUp, ActivitySquare, MessageSquare, History, User, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarItem = ({ icon: Icon, label, href, active }: { icon: any, label: string, href: string, active: boolean }) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <aside className="w-64 flex-col border-r bg-background hidden md:flex">
        <div className="p-4 border-b h-16 flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">MediVision AI</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active={location.pathname === "/dashboard"} />
          <SidebarItem icon={FileUp} label="Upload" href="/dashboard/upload" active={location.pathname === "/dashboard/upload"} />
          <SidebarItem icon={ActivitySquare} label="AI Analysis" href="/dashboard/analysis" active={location.pathname === "/dashboard/analysis"} />
          <SidebarItem icon={MessageSquare} label="Medical Chatbot" href="/dashboard/chat" active={location.pathname === "/dashboard/chat"} />
          <SidebarItem icon={History} label="Patient History" href="/dashboard/history" active={location.pathname === "/dashboard/history"} />
          <SidebarItem icon={User} label="Profile" href="/dashboard/profile" active={location.pathname === "/dashboard/profile"} />
          <SidebarItem icon={SettingsIcon} label="Settings" href="/dashboard/settings" active={location.pathname === "/dashboard/settings"} />
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-background flex items-center justify-between px-6 md:hidden">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">MediVision AI</span>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
