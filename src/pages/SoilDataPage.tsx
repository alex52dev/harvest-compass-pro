import { motion } from "framer-motion";
import { FlaskConical, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockSoilData, mockFarms } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
};

const getFarmName = (farmId: number) => mockFarms.find((f) => f.farmId === farmId)?.location.split(",")[0] || `Farm ${farmId}`;

const fertilityColor: Record<string, string> = {
  VERY_LOW: "bg-destructive/10 text-destructive",
  LOW: "bg-accent/10 text-accent-foreground",
  MODERATE: "bg-harvest-gold/10 text-harvest-earth",
  HIGH: "bg-primary/10 text-primary",
  VERY_HIGH: "bg-primary/20 text-primary",
};

export default function SoilDataPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Soil Data" description="Soil analysis and nutrient profiles for your farms">
        <Button size="sm" variant="outline"><RefreshCw className="h-4 w-4 mr-1" /> Fetch from Provider</Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockSoilData.map((s, i) => (
          <motion.div key={s.soilDataId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-harvest-earth" />
                <h3 className="font-heading font-semibold text-card-foreground">{getFarmName(s.farmId)}</h3>
              </div>
              {s.fertilityLevel && (
                <Badge className={`${fertilityColor[s.fertilityLevel] || "bg-muted text-muted-foreground"} border-0 font-body text-xs`}>
                  {s.fertilityLevel}
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {s.pH != null && (
                <div>
                  <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
                    <span>pH Level</span>
                    <span>{s.pH.toFixed(1)} / 14</span>
                  </div>
                  <Progress value={(s.pH / 14) * 100} className="h-2" />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Nitrogen", value: s.nitrogenLevel },
                  { label: "Phosphorus", value: s.phosphorusLevel },
                  { label: "Potassium", value: s.potassiumLevel },
                ].map((nutrient) => (
                  nutrient.value != null && (
                    <div key={nutrient.label} className="text-center p-2 rounded-md bg-muted">
                      <p className="text-xs text-muted-foreground font-body">{nutrient.label}</p>
                      <p className="text-sm font-body font-semibold text-card-foreground mt-0.5">{nutrient.value}</p>
                    </div>
                  )
                ))}
              </div>

              {s.organicCarbon != null && (
                <div className="flex justify-between items-center text-sm font-body">
                  <span className="text-muted-foreground">Organic Carbon</span>
                  <span className="font-semibold text-card-foreground">{s.organicCarbon}%</span>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground font-body mt-4">Source: {s.source} · Fetched: {new Date(s.fetchedAt).toLocaleDateString()}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
