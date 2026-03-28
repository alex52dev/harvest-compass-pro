import { Bell, AlertTriangle, Bug, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotificationStore, AlertItem } from "@/stores/notificationStore";
import { useLatestDashboard, usePestPredictionsByFarm } from "@/hooks/useApi";
import { useSessionStore } from "@/stores/sessionStore";
import { mockDashboard, mockPestPredictions } from "@/lib/mockData";
import { useEffect } from "react";

const iconMap: Record<string, React.ReactNode> = {
  climate: <CloudRain className="h-4 w-4 text-harvest-sky" />,
  pest: <Bug className="h-4 w-4 text-destructive" />,
  weather: <CloudRain className="h-4 w-4 text-harvest-sky" />,
  info: <AlertTriangle className="h-4 w-4 text-accent" />,
};

export function NotificationBell() {
  const { selectedFarmId } = useSessionStore();
  const farmId = selectedFarmId || 1;
  const dashQ = useLatestDashboard(farmId);
  const pestQ = usePestPredictionsByFarm(farmId);
  const { alerts, unreadCount, setAlerts, markAlertRead } = useNotificationStore();

  // Sync alerts from API data
  useEffect(() => {
    const newAlerts: AlertItem[] = [];
    const climateAlerts = dashQ.data?.climateAlerts || mockDashboard.climateAlerts || [];
    const pests = pestQ.data || mockPestPredictions.filter((p) => p.farmId === farmId);

    climateAlerts.forEach((alert, i) => {
      newAlerts.push({ id: `climate-${i}`, type: "climate", message: alert, time: "Today", read: false });
    });
    pests.filter((p) => p.riskLevel === "HIGH" || p.riskLevel === "SEVERE").forEach((p) => {
      newAlerts.push({ id: `pest-${p.predictionId}`, type: "pest", message: `${p.pestOrDiseaseType} — ${p.riskLevel} risk`, time: "Today", read: false });
    });

    if (newAlerts.length > 0) setAlerts(newAlerts);
  }, [dashQ.data, pestQ.data, farmId]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-body">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h4 className="font-heading font-semibold text-sm">Notifications</h4>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground font-body text-center">No new alerts</p>
          ) : (
            alerts.map((n) => (
              <div
                key={n.id}
                onClick={() => markAlertRead(n.id)}
                className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0 cursor-pointer ${n.read ? "opacity-50" : ""}`}
              >
                {iconMap[n.type] || iconMap.info}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-card-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
