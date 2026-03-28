import { motion } from "framer-motion";
import { Plus, Search, MapPin, Droplets, Ruler, Sprout, Users, Tractor, Trash2, Phone, Globe } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockFarms, mockFarmers } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useFarms, useFarmers, useDeleteFarmer, useDeleteFarm } from "@/hooks/useApi";
import { CardSkeleton } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { FarmerFormDialog } from "@/components/FarmerFormDialog";
import { useSessionStore } from "@/stores/sessionStore";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35 } }),
};

const langColors: Record<string, string> = {
  ENGLISH: "bg-harvest-sky/10 text-harvest-sky",
  ISIZULU: "bg-primary/10 text-primary",
  ISIXHOSA: "bg-accent/10 text-accent-foreground",
  AFRIKAANS: "bg-harvest-gold/10 text-harvest-earth",
};

export default function FarmManagementPage() {
  const [search, setSearch] = useState("");
  const { data: apiFarms, isLoading: farmsLoading, isError: farmsError, refetch: refetchFarms } = useFarms();
  const { data: apiFarmers, isLoading: farmersLoading, isError: farmersError, refetch: refetchFarmers } = useFarmers();
  const deleteFarmerMut = useDeleteFarmer();
  const deleteFarmMut = useDeleteFarm();
  const { selectedFarmId, setSelectedFarm } = useSessionStore();

  const farms = apiFarms || mockFarms;
  const farmers = apiFarmers || mockFarmers;

  const filteredFarms = farms.filter((f) => f.location.toLowerCase().includes(search.toLowerCase()));
  const filteredFarmers = farmers.filter(
    (f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase())
  );

  const getFarmerName = (farmerId: number) => farmers.find((f) => f.farmerId === farmerId)?.name || "Unknown";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Farm Management" description="Manage farms, farmers, and property details" />

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 font-body" />
      </div>

      <Tabs defaultValue="farms" className="w-full">
        <TabsList className="mb-6 bg-muted font-body">
          <TabsTrigger value="farms" className="font-body text-xs"><Tractor className="h-3 w-3 mr-1" />Farms</TabsTrigger>
          <TabsTrigger value="farmers" className="font-body text-xs"><Users className="h-3 w-3 mr-1" />Farmers</TabsTrigger>
        </TabsList>

        <TabsContent value="farms">
          <div className="flex justify-end mb-4">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Farm</Button>
          </div>
          {farmsLoading && !apiFarms ? (
            <CardSkeleton count={4} />
          ) : farmsError && !apiFarms ? (
            <ErrorState message="Could not load farms" onRetry={() => refetchFarms()} />
          ) : filteredFarms.length === 0 ? (
            <EmptyState title="No farms found" description="Add a farm to get started." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFarms.map((farm, i) => (
                <motion.div
                  key={farm.farmId}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  onClick={() => setSelectedFarm(farm.farmId)}
                  className={`bg-card rounded-lg shadow-card border p-5 hover:shadow-elevated transition-all cursor-pointer ${
                    selectedFarmId === farm.farmId ? "border-primary ring-1 ring-primary/30" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-card-foreground">{farm.location}</h3>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">Owner: {getFarmerName(farm.farmerId)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedFarmId === farm.farmId && (
                        <Badge className="bg-primary/10 text-primary border-0 font-body text-xs">Active</Badge>
                      )}
                      {farm.soilType && <Badge variant="secondary" className="font-body text-xs">{farm.soilType.replace("_", " ")}</Badge>}
                    </div>
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
        </TabsContent>

        <TabsContent value="farmers">
          <div className="flex justify-end mb-4">
            <FarmerFormDialog trigger={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Farmer</Button>} />
          </div>
          {farmersLoading && !apiFarmers ? (
            <CardSkeleton count={6} />
          ) : farmersError && !apiFarmers ? (
            <ErrorState message="Could not load farmers" onRetry={() => refetchFarmers()} />
          ) : filteredFarmers.length === 0 ? (
            <EmptyState title="No farmers found" description="Add a new farmer." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFarmers.map((farmer, i) => (
                <motion.div key={farmer.farmerId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 hover:shadow-elevated transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center text-primary-foreground font-heading font-semibold text-sm">
                      {farmer.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className={`${langColors[farmer.language] || "bg-muted text-muted-foreground"} border-0 font-body text-xs`}>
                        {farmer.language}
                      </Badge>
                      <FarmerFormDialog trigger={<Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"><Globe className="h-3 w-3" /></Button>} farmer={farmer} />
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-card-foreground">{farmer.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                      <MapPin className="h-3 w-3" /> {farmer.location}
                    </div>
                    {farmer.contactNumber && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                        <Phone className="h-3 w-3" /> {farmer.contactNumber}
                      </div>
                    )}
                    {farmer.literacyLevel && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                        <Globe className="h-3 w-3" /> Literacy: {farmer.literacyLevel}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
