import { motion } from "framer-motion";
import { BarChart3, Bug, ShieldAlert, Store, Lightbulb, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockYieldPredictions, mockPestPredictions, mockRiskAssessments, mockMarketPredictions, mockAdaptiveRecommendations, mockFarms, mockCrops } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35 } }),
};

const riskBadgeColor: Record<string, "destructive" | "secondary" | "default"> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "destructive",
  SEVERE: "destructive",
  CRITICAL: "destructive",
};

const getFarmName = (farmId: number) => mockFarms.find((f) => f.farmId === farmId)?.location.split(",")[0] || `Farm ${farmId}`;
const getCropName = (cropId: number) => mockCrops.find((c) => c.cropId === cropId)?.name || `Crop ${cropId}`;

export default function PredictionsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Predictions Hub" description="AI-powered insights across yield, risk, market, and pest analysis" />

      <Tabs defaultValue="yield" className="w-full">
        <TabsList className="mb-6 bg-muted font-body flex-wrap h-auto gap-1">
          <TabsTrigger value="yield" className="font-body text-xs"><BarChart3 className="h-3 w-3 mr-1" />Yield</TabsTrigger>
          <TabsTrigger value="pest" className="font-body text-xs"><Bug className="h-3 w-3 mr-1" />Pest & Disease</TabsTrigger>
          <TabsTrigger value="risk" className="font-body text-xs"><ShieldAlert className="h-3 w-3 mr-1" />Risk</TabsTrigger>
          <TabsTrigger value="market" className="font-body text-xs"><Store className="h-3 w-3 mr-1" />Market</TabsTrigger>
          <TabsTrigger value="recommendations" className="font-body text-xs"><Lightbulb className="h-3 w-3 mr-1" />Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="yield">
          <div className="bg-card rounded-lg shadow-card border border-border p-5 mb-6">
            <h3 className="font-heading font-semibold text-card-foreground mb-4">Yield Predictions</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockYieldPredictions.map((y) => ({ name: `${getFarmName(y.farmId)} - ${getCropName(y.cropId)}`, yield: y.expectedYieldTons, profit: (y.expectedProfitZAR || 0) / 1000 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="yield" name="Yield (tons)" fill="hsl(145, 63%, 32%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {mockYieldPredictions.map((y, i) => (
              <motion.div key={y.predictionId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-card-foreground">{getFarmName(y.farmId)} — {getCropName(y.cropId)}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">Generated {new Date(y.generatedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-semibold text-card-foreground">{y.expectedYieldTons.toLocaleString()} t</p>
                  {y.expectedProfitZAR && <p className="text-xs text-primary font-body">R {y.expectedProfitZAR.toLocaleString()}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pest">
          <div className="space-y-3">
            {mockPestPredictions.map((p, i) => (
              <motion.div key={p.predictionId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-heading font-semibold text-card-foreground">{p.pestOrDiseaseType}</h4>
                    <p className="text-xs text-muted-foreground font-body">{getFarmName(p.farmId)} — {getCropName(p.cropId)}</p>
                  </div>
                  <Badge variant={riskBadgeColor[p.riskLevel] || "secondary"} className="font-body">{p.riskLevel}</Badge>
                </div>
                {p.probability != null && (
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div className="bg-destructive h-2 rounded-full transition-all" style={{ width: `${p.probability * 100}%` }} />
                  </div>
                )}
                {p.recommendedAction && <p className="text-sm text-muted-foreground font-body">{p.recommendedAction}</p>}
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risk">
          <div className="space-y-3">
            {mockRiskAssessments.map((r, i) => (
              <motion.div key={r.riskId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading font-semibold text-card-foreground">{getFarmName(r.farmId)}</h4>
                  <Badge variant={riskBadgeColor[r.overallRiskLevel] || "secondary"} className="font-body">{r.overallRiskLevel}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Drought", value: r.droughtProbability },
                    { label: "Pest", value: r.pestProbability },
                    { label: "Market", value: r.marketVolatilityProbability },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-xs text-muted-foreground font-body mb-1">{item.label}</p>
                      <div className="w-full bg-muted rounded-full h-2 mb-1">
                        <div className={`h-2 rounded-full transition-all ${item.value > 0.6 ? "bg-destructive" : item.value > 0.3 ? "bg-accent" : "bg-primary"}`} style={{ width: `${item.value * 100}%` }} />
                      </div>
                      <p className="text-sm font-body font-semibold text-card-foreground">{Math.round(item.value * 100)}%</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market">
          <div className="bg-card rounded-lg shadow-card border border-border p-5 mb-6">
            <h3 className="font-heading font-semibold text-card-foreground mb-4">Market Price Predictions</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockMarketPredictions.map((m) => ({ name: `${getCropName(m.cropId)} (${m.region})`, price: m.predictedPriceZAR, confidence: Math.round((m.confidenceScore || 0) * 100) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="price" name="Price (ZAR)" fill="hsl(38, 70%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {mockMarketPredictions.map((m, i) => (
              <motion.div key={m.predictionId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-card-foreground">{getCropName(m.cropId)} — {m.region}</p>
                  <p className="text-xs text-muted-foreground font-body">Forecast: {m.forecastDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-semibold text-card-foreground">R {m.predictedPriceZAR.toLocaleString()}</p>
                  {m.confidenceScore && <p className="text-xs text-muted-foreground font-body">{Math.round(m.confidenceScore * 100)}% confidence</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-3">
            {mockAdaptiveRecommendations.map((r, i) => (
              <motion.div key={r.recommendationId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    <h4 className="font-heading font-semibold text-card-foreground">{r.recommendationType.replace(/_/g, " ")}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground font-body">{getFarmName(r.farmId)}{r.cropId ? ` — ${getCropName(r.cropId)}` : ""}</p>
                </div>
                {r.reason && <p className="text-sm text-muted-foreground font-body leading-relaxed">{r.reason}</p>}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
