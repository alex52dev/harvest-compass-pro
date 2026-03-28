import { motion } from "framer-motion";
import { Plus, Search, Sprout, Clock, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockCrops } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.35 } }),
};

const catColors: Record<string, string> = {
  GRAIN: "bg-harvest-gold/10 text-harvest-earth",
  VEGETABLE: "bg-primary/10 text-primary",
  FRUIT: "bg-destructive/10 text-destructive",
  LEGUME: "bg-harvest-earth/10 text-harvest-earth",
  OILSEED: "bg-accent/10 text-accent-foreground",
};

export default function CropsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockCrops.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Crop Catalog" description="Browse and manage crop varieties">
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Crop</Button>
      </PageHeader>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search crops..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 font-body" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((crop, i) => (
          <motion.div key={crop.cropId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 hover:shadow-elevated transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sprout className="h-4 w-4 text-primary" />
              </div>
              {crop.category && (
                <Badge className={`${catColors[crop.category] || "bg-muted text-muted-foreground"} border-0 font-body text-xs`}>
                  {crop.category}
                </Badge>
              )}
            </div>
            <h3 className="font-heading font-semibold text-card-foreground">{crop.name}</h3>
            <div className="mt-3 space-y-2">
              {crop.typicalYieldPerHectare && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                  <BarChart3 className="h-3 w-3" /> {crop.typicalYieldPerHectare} t/ha typical
                </div>
              )}
              {crop.growthDurationDays && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                  <Clock className="h-3 w-3" /> {crop.growthDurationDays} days growth
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
