import { Bell, AlertTriangle, Bug, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { mockDashboard, mockPestPredictions } from "@/lib/mockData";

interface Notification {
  id: string;
  type: "climate" | "pest" | "info";
  message: string;
  time: string;
}

function buildNotifications(): Notification[] {
  const notifs: Notification[] = [];
  mockDashboard.climateAlerts?.forEach((alert, i) => {
    notifs.push({ id: `climate-${i}`, type: "climate", message: alert, time: "Today" });
  });
  mockPestPredictions.filter((p) => p.riskLevel === "HIGH" || p.riskLevel === "SEVERE").forEach((p) => {
    notifs.push({ id: `pest-${p.predictionId}`, type: "pest", message: `${p.pestOrDiseaseType} — ${p.riskLevel} risk`, time: "Today" });
  });
  return notifs;
}

const iconMap = {
  climate: <CloudRain className="h-4 w-4 text-harvest-sky" />,
  pest: <Bug className="h-4 w-4 text-destructive" />,
  info: <AlertTriangle className="h-4 w-4 text-accent" />,
};

export function NotificationBell() {
  const notifications = buildNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-body">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h4 className="font-heading font-semibold text-sm">Notifications</h4>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground font-body text-center">No new alerts</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0">
                {iconMap[n.type]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-card-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{n.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
