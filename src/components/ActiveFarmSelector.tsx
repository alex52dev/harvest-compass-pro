import { MapPin, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSessionStore } from "@/stores/sessionStore";
import { useFarms } from "@/hooks/useApi";
import { mockFarms } from "@/lib/mockData";

export function ActiveFarmSelector() {
  const { selectedFarmId, setSelectedFarm } = useSessionStore();
  const { data: apiFarms } = useFarms();
  const farms = apiFarms || mockFarms;

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-primary shrink-0" />
      <Select
        value={selectedFarmId?.toString() || ""}
        onValueChange={(v) => setSelectedFarm(Number(v))}
      >
        <SelectTrigger className="h-8 w-[180px] font-body text-xs border-border bg-background">
          <SelectValue placeholder="Select farm" />
        </SelectTrigger>
        <SelectContent>
          {farms.map((farm) => (
            <SelectItem key={farm.farmId} value={farm.farmId.toString()} className="font-body text-xs">
              {farm.location.split(",")[0]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
