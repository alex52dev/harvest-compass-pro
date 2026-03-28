import { motion } from "framer-motion";
import { Store, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockMarketPredictions, mockCrops } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMarketPredictions, useCrops } from "@/hooks/useApi";
import { CardSkeleton } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

const getCropName = (cropId: number, crops: typeof mockCrops) =>
  crops.find((c) => c.cropId === cropId)?.name || `Crop ${cropId}`;

export default function MarketInsightsPage() {
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [cropFilter, setCropFilter] = useState<string>("all");
  const marketQ = useMarketPredictions();
  const cropsQ = useCrops();

  const markets = marketQ.data || mockMarketPredictions;
  const crops = cropsQ.data || mockCrops;

  const regions = [...new Set(markets.map((m) => m.region))];

  const filtered = markets.filter((m) => {
    if (regionFilter !== "all" && m.region !== regionFilter) return false;
    if (cropFilter !== "all" && m.cropId.toString() !== cropFilter) return false;
    return true;
  });

  const chartData = filtered.map((m) => ({
    name: `${getCropName(m.cropId, crops)} (${m.region})`,
    price: m.predictedPriceZAR,
    confidence: Math.round((m.confidenceScore || 0) * 100),
  }));

  // Best selling window
  const bestDeal = filtered.reduce((best, m) => {
    if (!best || m.predictedPriceZAR > best.predictedPriceZAR) return m;
    return best;
  }, filtered[0]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Market Insights" description="Current and predicted crop prices by region" />

      {/* Filters */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn} className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="h-8 w-[160px] font-body text-xs">
              <SelectValue placeholder="All regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-body text-xs">All Regions</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r} className="font-body text-xs">{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={cropFilter} onValueChange={setCropFilter}>
          <SelectTrigger className="h-8 w-[160px] font-body text-xs">
            <SelectValue placeholder="All crops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-body text-xs">All Crops</SelectItem>
            {crops.map((c) => (
              <SelectItem key={c.cropId} value={c.cropId.toString()} className="font-body text-xs">{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Best Sell Window */}
      {bestDeal && (
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn}
          className="rounded-xl p-5 gradient-gold text-primary-foreground mb-6"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            <div>
              <h3 className="font-heading font-bold text-lg">Best Selling Window</h3>
              <p className="font-body text-sm opacity-90">
                {getCropName(bestDeal.cropId, crops)} in {bestDeal.region} — R {bestDeal.predictedPriceZAR.toLocaleString()} by {bestDeal.forecastDate}
                {bestDeal.confidenceScore && ` (${Math.round(bestDeal.confidenceScore * 100)}% confidence)`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {marketQ.isLoading ? (
        <CardSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No market predictions" description="Market data will appear as predictions are generated." />
      ) : (
        <>
          {/* Price Chart */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 mb-6">
            <h3 className="font-heading font-semibold text-card-foreground mb-4">Predicted Prices (ZAR)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--card-foreground))" }} />
                <Bar dataKey="price" name="Price (ZAR)" fill="hsl(var(--harvest-gold))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="confidence" name="Confidence %" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Market Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m, i) => (
              <motion.div key={m.predictionId} custom={i + 3} initial="hidden" animate="visible" variants={fadeIn}
                className="bg-card rounded-lg shadow-card border border-border p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-heading font-semibold text-card-foreground">{getCropName(m.cropId, crops)}</h4>
                    <p className="text-xs text-muted-foreground font-body">{m.region}</p>
                  </div>
                  <Store className="h-4 w-4 text-harvest-gold" />
                </div>
                <p className="text-2xl font-heading font-bold text-card-foreground">R {m.predictedPriceZAR.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 text-xs font-body text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {m.forecastDate}
                  </div>
                  {m.confidenceScore && (
                    <Badge variant="secondary" className="font-body text-xs">
                      {Math.round(m.confidenceScore * 100)}% confidence
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
