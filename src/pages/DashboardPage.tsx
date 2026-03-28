import { motion } from "framer-motion";
import { Sprout, TrendingUp, AlertTriangle, Bug, CloudSun, Droplets, Wind, BarChart3, ArrowRight, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { mockDashboard, mockWeatherData, mockRiskAssessments, mockPestPredictions, mockFarms } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { useLatestDashboard, useRiskAssessmentsByFarm, usePestPredictionsByFarm, useWeatherDataByFarm } from "@/hooks/useApi";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const riskColors: Record<string, string> = {
  LOW: "hsl(var(--harvest-green))",
  MEDIUM: "hsl(var(--harvest-gold))",
  HIGH: "hsl(var(--destructive))",
  CRITICAL: "hsl(0, 60%, 40%)",
};

export default function DashboardPage() {
  // Try API first, fall back to mock
  const dashQuery = useLatestDashboard(1);
  const riskQuery = useRiskAssessmentsByFarm(1);
  const pestQuery = usePestPredictionsByFarm(1);
  const weatherQuery = useWeatherDataByFarm(1);

  const d = dashQuery.data || mockDashboard;
  const risks = riskQuery.data || mockRiskAssessments;
  const pests = pestQuery.data || mockPestPredictions;
  const weatherList = weatherQuery.data || mockWeatherData;
  const weather = weatherList[0];

  const riskData = risks.map((r) => {
    const farm = mockFarms.find((f) => f.farmId === r.farmId);
    return {
      name: farm?.location.split(",")[0] || `Farm ${r.farmId}`,
      drought: Math.round(r.droughtProbability * 100),
      pest: Math.round(r.pestProbability * 100),
      market: Math.round(r.marketVolatilityProbability * 100),
    };
  });

  const riskPieData = risks.length > 0 ? [
    { name: "Drought", value: Math.round(risks[0].droughtProbability * 100), color: "hsl(var(--harvest-sky))" },
    { name: "Pest", value: Math.round(risks[0].pestProbability * 100), color: "hsl(var(--destructive))" },
    { name: "Market", value: Math.round(risks[0].marketVolatilityProbability * 100), color: "hsl(var(--harvest-gold))" },
  ] : [];

  const weatherChartData = weatherList.map((w) => ({
    date: w.forecastDate,
    temp: w.temperatureCelsius,
    rain: w.rainfallMm,
  }));

  const isLoading = dashQuery.isLoading;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Farm Dashboard" description="Real-time insights for smarter farming decisions">
        <Button size="sm" variant="outline" onClick={() => { dashQuery.refetch(); riskQuery.refetch(); pestQuery.refetch(); weatherQuery.refetch(); }}>
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </PageHeader>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Predicted Yield", value: `${(d.predictedYieldTons || 0).toLocaleString()} t`, icon: <BarChart3 className="h-5 w-5" />, trend: "↑ 8% vs last season", trendUp: true },
          { label: "Expected Profit", value: `R ${(d.expectedProfitZAR || 0).toLocaleString()}`, icon: <TrendingUp className="h-5 w-5" />, trend: "↑ 12% projected", trendUp: true },
          { label: "Active Farms", value: mockFarms.length, icon: <Sprout className="h-5 w-5" /> },
          { label: "Risk Level", value: risks[0]?.overallRiskLevel || "N/A", icon: <AlertTriangle className="h-5 w-5" />, trend: risks[0]?.overallRiskLevel === "HIGH" ? "⚠ Action needed" : "Monitoring", trendUp: false },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weather Card */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-card-foreground">Today's Weather</h3>
            <CloudSun className="h-5 w-5 text-harvest-sky" />
          </div>
          {weather ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body">Temperature</span>
                <span className="font-body font-semibold text-card-foreground">{weather.temperatureCelsius}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body flex items-center gap-1"><Droplets className="h-3 w-3" /> Rainfall</span>
                <span className="font-body font-semibold text-card-foreground">{weather.rainfallMm} mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body">Humidity</span>
                <span className="font-body font-semibold text-card-foreground">{weather.humidityPercent}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body flex items-center gap-1"><Wind className="h-3 w-3" /> Wind</span>
                <span className="font-body font-semibold text-card-foreground">{weather.windSpeedKmh} km/h</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-body">No weather data available</p>
          )}
        </motion.div>

        {/* Alerts */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Climate Alerts</h3>
          <div className="space-y-3">
            {d.climateAlerts && d.climateAlerts.length > 0 ? d.climateAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-accent/10 border border-accent/20">
                <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-sm font-body text-card-foreground">{alert}</p>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground font-body">No active alerts</p>
            )}
          </div>
        </motion.div>

        {/* Pest Warnings */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-card-foreground">Pest Warnings</h3>
            <Bug className="h-5 w-5 text-destructive" />
          </div>
          <div className="space-y-3">
            {pests.slice(0, 3).map((p) => (
              <div key={p.predictionId} className="flex items-start gap-3 p-3 rounded-md bg-destructive/5 border border-destructive/10">
                <Badge variant={p.riskLevel === "HIGH" || p.riskLevel === "SEVERE" ? "destructive" : "secondary"} className="shrink-0 text-xs">
                  {p.riskLevel}
                </Badge>
                <div>
                  <p className="text-sm font-body font-medium text-card-foreground">{p.pestOrDiseaseType}</p>
                  {p.recommendedAction && <p className="text-xs text-muted-foreground font-body mt-0.5">{p.recommendedAction}</p>}
                </div>
              </div>
            ))}
            {pests.length === 0 && <p className="text-sm text-muted-foreground font-body">No active warnings</p>}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Chart */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Risk Assessment by Farm</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "DM Sans" }} className="fill-muted-foreground" />
              <YAxis tick={{ fontSize: 12, fontFamily: "DM Sans" }} unit="%" className="fill-muted-foreground" />
              <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--card-foreground))" }} />
              <Bar dataKey="drought" name="Drought" fill="hsl(var(--harvest-sky))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pest" name="Pest" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="market" name="Market" fill="hsl(var(--harvest-gold))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weather Trend */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Weather Forecast Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weatherChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
              <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--card-foreground))" }} />
              <Area type="monotone" dataKey="temp" name="Temp (°C)" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" />
              <Area type="monotone" dataKey="rain" name="Rain (mm)" stroke="hsl(var(--harvest-sky))" fill="hsl(var(--harvest-sky) / 0.1)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Seasonal Plan */}
      {d.seasonalPlan && (
        <motion.div custom={9} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-card-foreground">Seasonal Plan</h3>
            <Badge className="bg-primary/10 text-primary border-0 font-body">Active Season</Badge>
          </div>
          <p className="text-sm font-body text-muted-foreground leading-relaxed">{d.seasonalPlan}</p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {d.recommendedCrops?.map((crop) => (
              <Badge key={crop.cropId} variant="secondary" className="font-body">{crop.name}</Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "View All Farms", to: "/farms", color: "gradient-green" },
          { label: "Yield Predictions", to: "/predictions/yield", color: "gradient-gold" },
          { label: "Submit Feedback", to: "/feedback", color: "gradient-hero" },
        ].map((link, i) => (
          <motion.div key={link.label} custom={10 + i} initial="hidden" animate="visible" variants={fadeIn}>
            <Link to={link.to}>
              <div className={`${link.color} rounded-lg p-5 text-primary-foreground hover:opacity-90 transition-opacity`}>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold">{link.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
