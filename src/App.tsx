import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import FarmManagementPage from "./pages/FarmManagementPage";
import CropsPage from "./pages/CropsPage";
import WeatherAlertsPage from "./pages/WeatherAlertsPage";
import SoilInsightsPage from "./pages/SoilInsightsPage";
import RiskAssessmentPage from "./pages/RiskAssessmentPage";
import PredictionsPage from "./pages/PredictionsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import MarketInsightsPage from "./pages/MarketInsightsPage";
import FeedbackPage from "./pages/FeedbackPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/farm-management" element={<FarmManagementPage />} />
            <Route path="/crops" element={<CropsPage />} />
            <Route path="/weather-alerts" element={<WeatherAlertsPage />} />
            <Route path="/soil-insights" element={<SoilInsightsPage />} />
            <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
            <Route path="/predictions/*" element={<PredictionsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/market-insights" element={<MarketInsightsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Legacy redirects */}
            <Route path="/farmers" element={<Navigate to="/farm-management" replace />} />
            <Route path="/farms" element={<Navigate to="/farm-management" replace />} />
            <Route path="/weather" element={<Navigate to="/weather-alerts" replace />} />
            <Route path="/soil-data" element={<Navigate to="/soil-insights" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
