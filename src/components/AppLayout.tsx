import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { ActiveFarmSelector } from "@/components/ActiveFarmSelector";
import { useNetworkStore } from "@/stores/networkStore";
import { Badge } from "@/components/ui/badge";
import { WifiOff } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isOffline = useNetworkStore((s) => s.isOffline);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {isOffline && (
            <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-1.5 flex items-center gap-2">
              <WifiOff className="h-3.5 w-3.5 text-destructive" />
              <span className="text-xs font-body text-destructive">You're offline — changes will sync when reconnected</span>
            </div>
          )}
          <header className="h-14 flex items-center border-b border-border bg-card px-4 shrink-0">
            <SidebarTrigger className="mr-4" />
            <ActiveFarmSelector />
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
