import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn("bg-card rounded-lg p-5 shadow-card border border-border", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-body text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-heading font-semibold mt-1 text-card-foreground">{value}</p>
          {trend && (
            <p className={cn("text-xs font-body mt-1", trendUp ? "text-primary" : "text-destructive")}>
              {trend}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}
