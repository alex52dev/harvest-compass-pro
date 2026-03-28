import { motion } from "framer-motion";
import { Sprout, TrendingUp, AlertTriangle, Bug, CloudSun, Droplets, Wind, BarChart3, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { mockDashboard, mockWeatherData, mockRiskAssessments, mockPestPredictions, mockFarms } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const riskColors: Record<string, string> = {
  LOW: "hsl(145, 63%, 32%)",
  MEDIUM: "hsl(38, 70%, 55%)",
  HIGH: "hsl(0, 84%, 60%)",
  CRITICAL: "hsl(0, 60%, 40%)",
};

const riskData = mockRiskAssessments.map((r) => {
  const farm = mockFarms.find((f) => f.farmId === r.farmId);
  return {
    name: farm?.location.split(",")[0] || `Farm ${r.farmId}`,
    drought: Math.round(r.droughtProbability * 100),
    pest: Math.round(r.pestProbability * 100),
    market: Math.round(r.marketVolatilityProbability * 100),
  };
});

const riskPieData = [
  { name: "Drought", value: Math.round(mockRiskAssessments[0].droughtProbability * 100), color: "hsl(200, 60%, 50%)" },
  { name: "Pest", value: Math.round(mockRiskAssessments[0].pestProbability * 100), color: "hsl(0, 84%, 60%)" },
  { name: "Market", value: Math.round(mockRiskAssessments[0].marketVolatilityProbability * 100), color: "hsl(38, 70%, 55%)" },
];

export default function DashboardPage() {
  const d = mockDashboard;
  const weather = mockWeatherData[0];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Farm Dashboard" description="Real-time insights for smarter farming decisions" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Predicted Yield", value: `${d.predictedYieldTons?.toLocaleString()} t`, icon: <BarChart3 className="h-5 w-5" />, trend: "↑ 8% vs last season", trendUp: true },
          { label: "Expected Profit", value: `R ${(d.expectedProfitZAR || 0).toLocaleString()}`, icon: <TrendingUp className="h-5 w-5" />, trend: "↑ 12% projected", trendUp: true },
          { label: "Active Farms", value: mockFarms.length, icon: <Sprout className="h-5 w-5" /> },
          { label: "Risk Level", value: mockRiskAssessments[0].overallRiskLevel, icon: <AlertTriangle className="h-5 w-5" />, trend: "Drought watch active", trendUp: false },
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
        </motion.div>

        {/* Alerts */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Climate Alerts</h3>
          <div className="space-y-3">
            {d.climateAlerts?.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-accent/10 border border-accent/20">
                <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-sm font-body text-card-foreground">{alert}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pest Warnings */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-card-foreground">Pest Warnings</h3>
            <Bug className="h-5 w-5 text-destructive" />
          </div>
          <div className="space-y-3">
            {mockPestPredictions.slice(0, 2).map((p) => (
              <div key={p.predictionId} className="flex items-start gap-3 p-3 rounded-md bg-destructive/5 border border-destructive/10">
                <Badge variant={p.riskLevel === "HIGH" ? "destructive" : "secondary"} className="shrink-0 text-xs">
                  {p.riskLevel}
                </Badge>
                <div>
                  <p className="text-sm font-body font-medium text-card-foreground">{p.pestOrDiseaseType}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{p.recommendedAction}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Chart */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Risk Assessment by Farm</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "DM Sans" }} />
              <YAxis tick={{ fontSize: 12, fontFamily: "DM Sans" }} unit="%" />
              <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="drought" name="Drought" fill="hsl(200, 60%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pest" name="Pest" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="market" name="Market" fill="hsl(38, 70%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Pie */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Risk Distribution (Primary Farm)</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Seasonal Plan */}
      <motion.div custom={9} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-card-foreground">Seasonal Plan</h3>
          <Badge className="bg-primary/10 text-primary border-0 font-body">Active Season</Badge>
        </div>
        <p className="text-sm font-body text-muted-foreground leading-relaxed">{d.seasonalPlan}</p>
        <div className="flex gap-2 mt-4">
          {d.recommendedCrops?.map((crop) => (
            <Badge key={crop.cropId} variant="secondary" className="font-body">{crop.name}</Badge>
          ))}
        </div>
      </motion.div>

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
