import { motion } from "framer-motion";
import { ShieldAlert, Droplets, Bug, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockRiskAssessments, mockFarms } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { useRiskAssessmentsByFarm } from "@/hooks/useApi";
import { CardSkeleton } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { useSessionStore } from "@/stores/sessionStore";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
};

const getFarmName = (farmId: number) => mockFarms.find((f) => f.farmId === farmId)?.location.split(",")[0] || `Farm ${farmId}`;

const riskConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  LOW: { color: "text-primary", bg: "bg-primary/10 border-primary/20", icon: <CheckCircle className="h-8 w-8 text-primary" />, label: "Low Risk" },
  MEDIUM: { color: "text-harvest-gold", bg: "bg-harvest-gold/10 border-harvest-gold/20", icon: <AlertTriangle className="h-8 w-8 text-harvest-gold" />, label: "Medium Risk" },
  HIGH: { color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", icon: <ShieldAlert className="h-8 w-8 text-destructive" />, label: "High Risk" },
  CRITICAL: { color: "text-destructive", bg: "bg-destructive/15 border-destructive/30", icon: <ShieldAlert className="h-8 w-8 text-destructive animate-pulse" />, label: "Critical Risk" },
};

const riskBarColor = (value: number) =>
  value > 0.6 ? "bg-destructive" : value > 0.3 ? "bg-accent" : "bg-primary";

export default function RiskAssessmentPage() {
  const { selectedFarmId } = useSessionStore();
  const farmId = selectedFarmId || 1;
  const { data: apiRisks, isLoading } = useRiskAssessmentsByFarm(farmId);

  const risks = apiRisks || mockRiskAssessments.filter((r) => r.farmId === farmId);
  const latest = risks[0];
  const cfg = latest ? riskConfig[latest.overallRiskLevel] || riskConfig.MEDIUM : null;

  const radarData = latest ? [
    { factor: "Drought", value: Math.round(latest.droughtProbability * 100) },
    { factor: "Pest & Disease", value: Math.round(latest.pestProbability * 100) },
    { factor: "Market Volatility", value: Math.round(latest.marketVolatilityProbability * 100) },
  ] : [];

  // Mitigation suggestions
  const mitigations = latest ? [
    latest.droughtProbability > 0.5 && { priority: "high", action: "Switch to deficit irrigation to conserve water", factor: "Drought" },
    latest.droughtProbability > 0.3 && latest.droughtProbability <= 0.5 && { priority: "medium", action: "Monitor soil moisture levels closely", factor: "Drought" },
    latest.pestProbability > 0.5 && { priority: "high", action: "Apply biological pest control agents immediately", factor: "Pest" },
    latest.pestProbability > 0.3 && latest.pestProbability <= 0.5 && { priority: "medium", action: "Increase scouting frequency to twice weekly", factor: "Pest" },
    latest.marketVolatilityProbability > 0.5 && { priority: "high", action: "Consider forward contracts to lock in prices", factor: "Market" },
    latest.marketVolatilityProbability > 0.3 && latest.marketVolatilityProbability <= 0.5 && { priority: "medium", action: "Diversify crop portfolio to hedge risk", factor: "Market" },
  ].filter(Boolean) as { priority: string; action: string; factor: string }[] : [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Risk Assessment" description={`Farm risk analysis for ${getFarmName(farmId)}`} />

      {isLoading ? (
        <CardSkeleton count={3} />
      ) : !latest ? (
        <EmptyState title="No risk assessments" description="Risk data will appear once an assessment is generated." />
      ) : (
        <>
          {/* Overall Risk Card */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}
            className={`rounded-xl p-6 border ${cfg?.bg} mb-6`}
          >
            <div className="flex items-center gap-4">
              {cfg?.icon}
              <div>
                <h2 className={`font-heading text-2xl font-bold ${cfg?.color}`}>{cfg?.label}</h2>
                <p className="text-sm font-body text-muted-foreground mt-1">
                  Overall assessment based on drought, pest, and market risk factors
                </p>
              </div>
              <Badge className={`ml-auto text-lg font-heading px-4 py-1 ${cfg?.bg} ${cfg?.color} border-0`}>
                {latest.overallRiskLevel}
              </Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Risk Radar */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
              <h3 className="font-heading font-semibold text-card-foreground mb-4">Risk Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid className="stroke-border" />
                  <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12, fontFamily: "DM Sans" }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Radar dataKey="value" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--card-foreground))" }} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Risk Factors Detail */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
              <h3 className="font-heading font-semibold text-card-foreground mb-4">Risk Factors</h3>
              <div className="space-y-6">
                {[
                  { label: "Drought Risk", value: latest.droughtProbability, icon: <Droplets className="h-5 w-5 text-harvest-sky" /> },
                  { label: "Pest & Disease Risk", value: latest.pestProbability, icon: <Bug className="h-5 w-5 text-destructive" /> },
                  { label: "Market Volatility", value: latest.marketVolatilityProbability, icon: <TrendingDown className="h-5 w-5 text-harvest-gold" /> },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="font-body text-sm text-card-foreground">{item.label}</span>
                      </div>
                      <span className={`font-heading font-bold ${item.value > 0.6 ? "text-destructive" : item.value > 0.3 ? "text-accent" : "text-primary"}`}>
                        {Math.round(item.value * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all ${riskBarColor(item.value)}`} style={{ width: `${item.value * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mitigation Actions */}
          {mitigations.length > 0 && (
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
              <h3 className="font-heading font-semibold text-card-foreground mb-4">Recommended Mitigations</h3>
              <div className="space-y-3">
                {mitigations.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                    <Badge variant={m.priority === "high" ? "destructive" : "secondary"} className="font-body text-xs shrink-0 mt-0.5">
                      {m.priority}
                    </Badge>
                    <div>
                      <p className="text-sm font-body text-card-foreground">{m.action}</p>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">{m.factor} mitigation</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <p className="text-xs text-muted-foreground font-body mt-4">
            Last assessed: {new Date(latest.generatedAt).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
}
