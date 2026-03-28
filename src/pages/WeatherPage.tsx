import { motion } from "framer-motion";
import { CloudSun, Droplets, Wind, ThermometerSun, RefreshCw, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockWeatherData, mockFarms } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAllWeatherData, useFetchWeatherData } from "@/hooks/useApi";
import { CardSkeleton } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

const getFarmName = (farmId: number) => mockFarms.find((f) => f.farmId === farmId)?.location.split(",")[0] || `Farm ${farmId}`;

export default function WeatherPage() {
  const { data: apiWeather, isLoading, isError, refetch } = useAllWeatherData();
  const fetchMut = useFetchWeatherData();

  const weatherData = apiWeather || mockWeatherData;

  const chartData = weatherData.map((w) => ({
    date: w.forecastDate,
    temp: w.temperatureCelsius,
    rain: w.rainfallMm,
    humidity: w.humidityPercent,
  }));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Weather Data" description="Current conditions and forecasts for your farms">
        <Button size="sm" variant="outline" onClick={() => fetchMut.mutate(1)} disabled={fetchMut.isPending}>
          {fetchMut.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
          Fetch Latest
        </Button>
      </PageHeader>

      {/* Trend Chart */}
      {chartData.length > 1 && (
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5 mb-6">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Forecast Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
              <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--card-foreground))" }} />
              <Line type="monotone" dataKey="temp" name="Temp (°C)" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rain" name="Rain (mm)" stroke="hsl(var(--harvest-sky))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {isLoading && !apiWeather ? (
        <CardSkeleton count={3} />
      ) : isError && !apiWeather ? (
        <ErrorState message="Could not load weather data" onRetry={() => refetch()} />
      ) : weatherData.length === 0 ? (
        <EmptyState title="No weather data" description="Fetch weather data for your farms." actionLabel="Fetch Now" onAction={() => fetchMut.mutate(1)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherData.map((w, i) => (
            <motion.div key={w.weatherDataId} custom={i + 1} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-card-foreground">{getFarmName(w.farmId)}</h3>
                  <p className="text-xs text-muted-foreground font-body">{w.forecastDate}</p>
                </div>
                <Badge variant={w.dataType === "FORECAST" ? "default" : "secondary"} className="font-body text-xs">{w.dataType}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="text-xs text-muted-foreground font-body">Temp</p>
                    <p className="font-body font-semibold text-card-foreground">{w.temperatureCelsius}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-harvest-sky" />
                  <div>
                    <p className="text-xs text-muted-foreground font-body">Rain</p>
                    <p className="font-body font-semibold text-card-foreground">{w.rainfallMm} mm</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CloudSun className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground font-body">Humidity</p>
                    <p className="font-body font-semibold text-card-foreground">{w.humidityPercent}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground font-body">Wind</p>
                    <p className="font-body font-semibold text-card-foreground">{w.windSpeedKmh} km/h</p>
                  </div>
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
