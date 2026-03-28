import { motion } from "framer-motion";
import { CloudSun, Droplets, Wind, ThermometerSun, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockWeatherData, mockFarms } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

const getFarmName = (farmId: number) => mockFarms.find((f) => f.farmId === farmId)?.location.split(",")[0] || `Farm ${farmId}`;

export default function WeatherPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Weather Data" description="Current conditions and forecasts for your farms">
        <Button size="sm" variant="outline"><RefreshCw className="h-4 w-4 mr-1" /> Fetch Latest</Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockWeatherData.map((w, i) => (
          <motion.div key={w.weatherDataId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
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
    </div>
  );
}
