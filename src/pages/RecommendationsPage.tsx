import { motion } from "framer-motion";
import { Lightbulb, Sprout, Droplets, Bug, Scissors, Wheat, Zap } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockAdaptiveRecommendations, mockFarms, mockCrops } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { useAdaptiveRecommendations, useCropSuitabilityByFarm } from "@/hooks/useApi";
import { CardSkeleton } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { useSessionStore } from "@/stores/sessionStore";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

const getCropName = (cropId: number) => mockCrops.find((c) => c.cropId === cropId)?.name || `Crop ${cropId}`;
const getFarmName = (farmId: number) => mockFarms.find((f) => f.farmId === farmId)?.location.split(",")[0] || `Farm ${farmId}`;

const typeIcons: Record<string, React.ReactNode> = {
  CROP_SWAP: <Wheat className="h-5 w-5 text-harvest-gold" />,
  INTERVENTION: <Zap className="h-5 w-5 text-destructive" />,
  PLANTING_ADJUSTMENT: <Sprout className="h-5 w-5 text-primary" />,
  IRRIGATION_CHANGE: <Droplets className="h-5 w-5 text-harvest-sky" />,
  FERTILIZER_APPLICATION: <Lightbulb className="h-5 w-5 text-accent" />,
  PEST_CONTROL: <Bug className="h-5 w-5 text-destructive" />,
  HARVEST_TIMING: <Scissors className="h-5 w-5 text-harvest-earth" />,
};

const typePriority: Record<string, number> = {
  INTERVENTION: 1, PEST_CONTROL: 2, CROP_SWAP: 3,
  IRRIGATION_CHANGE: 4, FERTILIZER_APPLICATION: 5,
  PLANTING_ADJUSTMENT: 6, HARVEST_TIMING: 7,
};

export default function RecommendationsPage() {
  const { selectedFarmId } = useSessionStore();
  const farmId = selectedFarmId || 1;
  const adaptiveQ = useAdaptiveRecommendations();
  const suitabilityQ = useCropSuitabilityByFarm(farmId);

  const allRecs = adaptiveQ.data || mockAdaptiveRecommendations;
  const farmRecs = allRecs.filter((r) => r.farmId === farmId);
  const sorted = [...farmRecs].sort((a, b) => (typePriority[a.recommendationType] || 99) - (typePriority[b.recommendationType] || 99));

  const suitability = suitabilityQ.data;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="AI Recommendations" description={`Smart suggestions for ${getFarmName(farmId)}`} />

      {/* Crop Suitability */}
      {suitability && suitability.length > 0 && (
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 mb-6">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Top Recommended Crops</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {suitability[0]?.recommendedCrops?.slice(0, 3).map((crop, i) => (
              <div key={crop.cropId} className={`rounded-lg p-4 border ${i === 0 ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm ${i === 0 ? "gradient-green text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    #{i + 1}
                  </div>
                  <h4 className="font-heading font-semibold text-card-foreground">{crop.name}</h4>
                </div>
                {crop.category && <Badge variant="secondary" className="font-body text-xs">{crop.category}</Badge>}
                {crop.typicalYieldPerHectare && (
                  <p className="text-xs text-muted-foreground font-body mt-2">{crop.typicalYieldPerHectare} t/ha typical yield</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Adaptive Recommendations */}
      {adaptiveQ.isLoading ? (
        <CardSkeleton count={3} />
      ) : sorted.length === 0 ? (
        <EmptyState title="No recommendations" description="AI recommendations will appear as data is analyzed." />
      ) : (
        <div className="space-y-4">
          {sorted.map((r, i) => (
            <motion.div key={r.recommendationId} custom={i + 1} initial="hidden" animate="visible" variants={fadeIn}
              className="bg-card rounded-lg shadow-card border border-border p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {typeIcons[r.recommendationType] || <Lightbulb className="h-5 w-5 text-accent" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-heading font-semibold text-card-foreground">
                      {r.recommendationType.replace(/_/g, " ")}
                    </h4>
                    <Badge variant="secondary" className="font-body text-xs">
                      {r.cropId ? getCropName(r.cropId) : "General"}
                    </Badge>
                    <Badge className={`font-body text-xs border-0 ${
                      (typePriority[r.recommendationType] || 99) <= 2
                        ? "bg-destructive/10 text-destructive"
                        : (typePriority[r.recommendationType] || 99) <= 4
                        ? "bg-accent/10 text-accent-foreground"
                        : "bg-primary/10 text-primary"
                    }`}>
                      {(typePriority[r.recommendationType] || 99) <= 2 ? "High Priority" :
                       (typePriority[r.recommendationType] || 99) <= 4 ? "Medium" : "Low"}
                    </Badge>
                  </div>
                  {r.reason && (
                    <p className="text-sm text-muted-foreground font-body leading-relaxed mt-1">{r.reason}</p>
                  )}
                  <p className="text-xs text-muted-foreground font-body mt-2">
                    Generated {new Date(r.generatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
