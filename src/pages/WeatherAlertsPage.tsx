import { motion } from "framer-motion";
import { CloudSun, Droplets, Wind, ThermometerSun, RefreshCw, Loader2, AlertTriangle, Bell } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockWeatherData, mockFarms, mockDashboard } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeatherDataByFarm, useFetchWeatherData, useLatestDashboard } from "@/hooks/useApi";
import { CardSkeleton } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { useSessionStore } from "@/stores/sessionStore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

const getFarmName = (farmId: number) => mockFarms.find((f) => f.farmId === farmId)?.location.split(",")[0] || `Farm ${farmId}`;

export default function WeatherAlertsPage() {
  const { selectedFarmId } = useSessionStore();
  const farmId = selectedFarmId || 1;
  const { data: apiWeather, isLoading, isError, refetch } = useWeatherDataByFarm(farmId);
  const dashQ = useLatestDashboard(farmId);
  const fetchMut = useFetchWeatherData();

  const weatherData = apiWeather || mockWeatherData;
  const climateAlerts = dashQ.data?.climateAlerts || mockDashboard.climateAlerts || [];

  const chartData = weatherData.map((w) => ({
    date: w.forecastDate,
    temp: w.temperatureCelsius,
    rain: w.rainfallMm,
    humidity: w.humidityPercent,
  }));

  const current = weatherData[0];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Weather & Alerts" description={`Current conditions and forecasts for ${getFarmName(farmId)}`}>
        <Button size="sm" variant="outline" onClick={() => fetchMut.mutate(farmId)} disabled={fetchMut.isPending}>
          {fetchMut.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
          Fetch Latest
        </Button>
      </PageHeader>

      {/* Climate Alerts Banner */}
      {climateAlerts.length > 0 && (
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn} className="mb-6 space-y-2">
          {climateAlerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-body font-medium text-card-foreground text-sm">{alert}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">Active alert</p>
              </div>
              <Badge className="ml-auto bg-accent/10 text-accent-foreground border-0 font-body text-xs shrink-0">Warning</Badge>
            </div>
          ))}
        </motion.div>
      )}

      {/* Current Weather */}
      {current && (
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Temperature", value: `${current.temperatureCelsius}°C`, icon: <ThermometerSun className="h-5 w-5 text-destructive" />, bg: "bg-destructive/5" },
            { label: "Rainfall", value: `${current.rainfallMm} mm`, icon: <Droplets className="h-5 w-5 text-harvest-sky" />, bg: "bg-harvest-sky/5" },
            { label: "Humidity", value: `${current.humidityPercent}%`, icon: <CloudSun className="h-5 w-5 text-primary" />, bg: "bg-primary/5" },
            { label: "Wind Speed", value: `${current.windSpeedKmh} km/h`, icon: <Wind className="h-5 w-5 text-muted-foreground" />, bg: "bg-muted" },
          ].map((item) => (
            <div key={item.label} className={`${item.bg} rounded-lg p-4 border border-border`}>
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <span className="text-xs text-muted-foreground font-body">{item.label}</span>
              </div>
              <p className="text-xl font-heading font-semibold text-card-foreground">{item.value}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Forecast Trend Chart */}
      {chartData.length > 1 && (
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 mb-6">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Forecast Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
              <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--card-foreground))" }} />
              <Area type="monotone" dataKey="temp" name="Temp (°C)" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" />
              <Area type="monotone" dataKey="rain" name="Rain (mm)" stroke="hsl(var(--harvest-sky))" fill="hsl(var(--harvest-sky) / 0.1)" />
              <Area type="monotone" dataKey="humidity" name="Humidity (%)" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Forecast Cards */}
      {isLoading && !apiWeather ? (
        <CardSkeleton count={3} />
      ) : isError && !apiWeather ? (
        <ErrorState message="Could not load weather data" onRetry={() => refetch()} />
      ) : weatherData.length === 0 ? (
        <EmptyState title="No weather data" description="Fetch weather data for your farm." actionLabel="Fetch Now" onAction={() => fetchMut.mutate(farmId)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherData.map((w, i) => (
            <motion.div key={w.weatherDataId} custom={i + 3} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-heading font-semibold text-card-foreground text-sm">{w.forecastDate}</p>
                <Badge variant={w.dataType === "FORECAST" ? "default" : "secondary"} className="font-body text-xs">{w.dataType}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <ThermometerSun className="h-3.5 w-3.5 text-destructive" />
                  <span className="font-body text-card-foreground">{w.temperatureCelsius}°C</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Droplets className="h-3.5 w-3.5 text-harvest-sky" />
                  <span className="font-body text-card-foreground">{w.rainfallMm} mm</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CloudSun className="h-3.5 w-3.5 text-primary" />
                  <span className="font-body text-card-foreground">{w.humidityPercent}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wind className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-body text-card-foreground">{w.windSpeedKmh} km/h</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-body mt-3">Source: {w.source}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
