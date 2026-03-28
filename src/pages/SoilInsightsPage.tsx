import { motion } from "framer-motion";
import { FlaskConical, RefreshCw, Loader2, Beaker, Droplets, Leaf } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockSoilData, mockFarms } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSoilDataByFarm, useFetchSoilData } from "@/hooks/useApi";
import { CardSkeleton } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { useSessionStore } from "@/stores/sessionStore";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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

export default function SoilInsightsPage() {
  const { selectedFarmId } = useSessionStore();
  const farmId = selectedFarmId || 1;
  const { data: apiSoilData, isLoading, isError, refetch } = useSoilDataByFarm(farmId);
  const fetchMut = useFetchSoilData();

  const soilData = apiSoilData || mockSoilData.filter((s) => s.farmId === farmId);
  const latest = soilData[0];

  // Nutrient bar chart data
  const nutrientData = latest ? [
    { name: "Nitrogen", value: latest.nitrogenLevel || 0, fill: "hsl(var(--primary))" },
    { name: "Phosphorus", value: latest.phosphorusLevel || 0, fill: "hsl(var(--harvest-gold))" },
    { name: "Potassium", value: latest.potassiumLevel || 0, fill: "hsl(var(--harvest-sky))" },
  ] : [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Soil Insights" description={`Soil analysis and nutrient profiles for ${getFarmName(farmId)}`}>
        <Button size="sm" variant="outline" onClick={() => fetchMut.mutate(farmId)} disabled={fetchMut.isPending}>
          {fetchMut.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
          Fetch from AGIS
        </Button>
      </PageHeader>

      {isLoading && !apiSoilData ? (
        <CardSkeleton count={2} />
      ) : isError && !apiSoilData ? (
        <ErrorState message="Could not load soil data" onRetry={() => refetch()} />
      ) : soilData.length === 0 ? (
        <EmptyState title="No soil data" description="Fetch data from the soil provider." actionLabel="Fetch Now" onAction={() => fetchMut.mutate(farmId)} />
      ) : (
        <>
          {/* Summary Row */}
          {latest && (
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 border border-border shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <Beaker className="h-4 w-4 text-harvest-earth" />
                  <span className="text-xs text-muted-foreground font-body">pH Level</span>
                </div>
                <p className="text-2xl font-heading font-semibold text-card-foreground">{latest.pH?.toFixed(1) || "—"}</p>
                <p className="text-xs text-muted-foreground font-body mt-1">{latest.pH && latest.pH < 6 ? "Acidic" : latest.pH && latest.pH > 7.5 ? "Alkaline" : "Neutral"}</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-body">Organic Carbon</span>
                </div>
                <p className="text-2xl font-heading font-semibold text-card-foreground">{latest.organicCarbon?.toFixed(1) || "—"}%</p>
                <p className="text-xs text-muted-foreground font-body mt-1">{latest.organicCarbon && latest.organicCarbon > 2 ? "Good" : "Low"}</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground font-body">Fertility</span>
                </div>
                <Badge className={`${fertilityColor[latest.fertilityLevel || ""] || "bg-muted text-muted-foreground"} border-0 font-body text-sm mt-1`}>
                  {latest.fertilityLevel?.replace("_", " ") || "N/A"}
                </Badge>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-harvest-sky" />
                  <span className="text-xs text-muted-foreground font-body">Source</span>
                </div>
                <p className="text-sm font-body font-medium text-card-foreground mt-1">{latest.source}</p>
                <p className="text-xs text-muted-foreground font-body">{new Date(latest.fetchedAt).toLocaleDateString()}</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Radar Chart */}
            {latest && (
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
                <h3 className="font-heading font-semibold text-card-foreground mb-4">Nutrient Profile</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={[
                    { metric: "pH", value: latest.pH ? (latest.pH / 14) * 100 : 0 },
                    { metric: "Nitrogen", value: latest.nitrogenLevel ? Math.min(latest.nitrogenLevel, 100) : 0 },
                    { metric: "Phosphorus", value: latest.phosphorusLevel ? Math.min(latest.phosphorusLevel, 100) : 0 },
                    { metric: "Potassium", value: latest.potassiumLevel ? Math.min(latest.potassiumLevel / 3, 100) : 0 },
                    { metric: "Org. Carbon", value: latest.organicCarbon ? Math.min(latest.organicCarbon * 20, 100) : 0 },
                  ]}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                    <PolarRadiusAxis tick={false} domain={[0, 100]} />
                    <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--card-foreground))" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Nutrient Bars */}
            {nutrientData.length > 0 && (
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
                <h3 className="font-heading font-semibold text-card-foreground mb-4">Nutrient Levels</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={nutrientData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fontFamily: "DM Sans" }} width={90} />
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--card-foreground))" }} />
                    <Bar dataKey="value" name="Level" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>

          {/* pH Bar */}
          {latest?.pH != null && (
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 mb-6">
              <h3 className="font-heading font-semibold text-card-foreground mb-3">pH Scale</h3>
              <div className="relative">
                <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
                  <span>0 (Acidic)</span>
                  <span>7 (Neutral)</span>
                  <span>14 (Alkaline)</span>
                </div>
                <div className="h-4 rounded-full bg-gradient-to-r from-destructive via-primary to-harvest-sky relative">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-6 rounded bg-card border-2 border-foreground shadow-md"
                    style={{ left: `${(latest.pH / 14) * 100}%`, transform: "translate(-50%, -50%)" }}
                  />
                </div>
                <p className="text-center text-sm font-body font-semibold text-card-foreground mt-2">
                  Current pH: {latest.pH.toFixed(1)}
                </p>
              </div>
            </motion.div>
          )}

          {/* Soil Composition */}
          {latest && (latest.sandContent != null || latest.siltContent != null || latest.clayContent != null) && (
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
              <h3 className="font-heading font-semibold text-card-foreground mb-4">Soil Composition</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Sand", value: latest.sandContent, color: "bg-harvest-gold" },
                  { label: "Silt", value: latest.siltContent, color: "bg-harvest-earth" },
                  { label: "Clay", value: latest.clayContent, color: "bg-destructive" },
                ].map((item) => item.value != null && (
                  <div key={item.label} className="text-center">
                    <p className="text-xs text-muted-foreground font-body mb-2">{item.label}</p>
                    <div className="mx-auto w-16 h-16 rounded-full border-4 border-border flex items-center justify-center">
                      <span className="font-heading font-semibold text-card-foreground">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
