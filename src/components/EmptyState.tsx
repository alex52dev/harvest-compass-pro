import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ title = "No data yet", description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <Inbox className="h-7 w-7 text-muted-foreground" />}
      </div>
      <h3 className="font-heading font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm font-body text-muted-foreground mb-4 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
