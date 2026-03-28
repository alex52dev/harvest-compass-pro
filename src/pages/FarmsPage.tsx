import { motion } from "framer-motion";
import { Plus, Search, MapPin, Droplets, Ruler, Sprout } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockFarms, mockFarmers } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useFarms, useFarmers } from "@/hooks/useApi";
import { CardSkeleton } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35 } }),
};

export default function FarmsPage() {
  const [search, setSearch] = useState("");
  const { data: apiFarms, isLoading, isError, refetch } = useFarms();
  const { data: apiFarmers } = useFarmers();

  const farms = apiFarms || mockFarms;
  const farmers = apiFarmers || mockFarmers;
  const filtered = farms.filter((f) => f.location.toLowerCase().includes(search.toLowerCase()));

  const getFarmerName = (farmerId: number) => farmers.find((f) => f.farmerId === farmerId)?.name || "Unknown";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Farms" description="Monitor and manage farm properties">
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Farm</Button>
      </PageHeader>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search farms..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 font-body" />
      </div>

      {isLoading && !apiFarms ? (
        <CardSkeleton count={4} />
      ) : isError && !apiFarms ? (
        <ErrorState message="Could not load farms" onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No farms found" description="Add a farm to get started." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((farm, i) => (
            <motion.div key={farm.farmId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 hover:shadow-elevated transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading font-semibold text-card-foreground">{farm.location}</h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">Owner: {getFarmerName(farm.farmerId)}</p>
                </div>
                {farm.soilType && <Badge variant="secondary" className="font-body text-xs">{farm.soilType.replace("_", " ")}</Badge>}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {farm.sizeInHectares && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Ruler className="h-3 w-3" /> {farm.sizeInHectares} ha
                  </div>
                )}
                {farm.irrigationMethod && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Droplets className="h-3 w-3" /> {farm.irrigationMethod.replace("_", " ")}
                  </div>
                )}
              </div>
              {farm.currentCrops && farm.currentCrops.length > 0 && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Sprout className="h-3 w-3 text-primary" />
                  {farm.currentCrops.map((crop) => (
                    <Badge key={crop} className="bg-primary/10 text-primary border-0 font-body text-xs">{crop}</Badge>
                  ))}
                </div>
              )}
              {farm.financialGoals && (
                <p className="text-xs text-muted-foreground font-body mt-3 italic">"{farm.financialGoals}"</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
