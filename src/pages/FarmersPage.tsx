import { motion } from "framer-motion";
import { Plus, Search, Phone, MapPin, Globe, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockFarmers } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useFarmers, useDeleteFarmer } from "@/hooks/useApi";
import { CardSkeleton } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { FarmerFormDialog } from "@/components/FarmerFormDialog";

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

export default function FarmersPage() {
  const [search, setSearch] = useState("");
  const { data: apiFarmers, isLoading, isError, refetch } = useFarmers();
  const deleteMut = useDeleteFarmer();

  const farmers = apiFarmers || mockFarmers;
  const filtered = farmers.filter(
    (f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Farmers" description="Manage farmer profiles and contacts">
        <FarmerFormDialog trigger={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Farmer</Button>} />
      </PageHeader>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search farmers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 font-body" />
      </div>

      {isLoading && !apiFarmers ? (
        <CardSkeleton count={6} />
      ) : isError && !apiFarmers ? (
        <ErrorState message="Could not load farmers from server. Showing cached data." onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No farmers found" description="Try adjusting your search or add a new farmer." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((farmer, i) => (
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
    </div>
  );
}
