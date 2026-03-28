import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  farmersApi, farmsApi, cropsApi, soilDataApi, weatherDataApi,
  yieldPredictionsApi, pestDiseasePredictionsApi, riskAssessmentsApi,
  marketPredictionsApi, adaptiveRecommendationsApi, cropSuitabilityApi,
  feedbackApi, dashboardApi, ApiError,
} from "@/lib/api";
import type {
  FarmerRequest, FarmRequest, CropRequest, SoilDataRequest,
  WeatherDataRequest, YieldPredictionRequest, PestDiseasePredictionRequest,
  RiskAssessmentRequest, MarketPredictionRequest, AdaptiveRecommendationRequest,
  FarmerFeedbackRequest, DashboardOutputRequest, CropSuitabilityResultRequest,
} from "@/types/api";
import { toast } from "sonner";

// Stale times
const STATIC_STALE = 1000 * 60 * 30; // 30min for crops, enums
const DYNAMIC_STALE = 1000 * 60 * 5;  // 5min for predictions, weather

function onError(err: unknown) {
  const msg = err instanceof ApiError ? err.message : "Something went wrong";
  toast.error(msg);
}

// ============ FARMERS ============
export function useFarmers() {
  return useQuery({ queryKey: ["farmers"], queryFn: farmersApi.getAll, staleTime: DYNAMIC_STALE });
}
export function useFarmer(id: number) {
  return useQuery({ queryKey: ["farmers", id], queryFn: () => farmersApi.getById(id), enabled: !!id });
}
export function useCreateFarmer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FarmerRequest) => farmersApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["farmers"] }); toast.success("Farmer created"); },
    onError,
  });
}
export function useUpdateFarmer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FarmerRequest }) => farmersApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["farmers"] }); toast.success("Farmer updated"); },
    onError,
  });
}
export function useDeleteFarmer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => farmersApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["farmers"] }); toast.success("Farmer deleted"); },
    onError,
  });
}

// ============ FARMS ============
export function useFarms() {
  return useQuery({ queryKey: ["farms"], queryFn: farmsApi.getAll, staleTime: DYNAMIC_STALE });
}
export function useFarm(id: number) {
  return useQuery({ queryKey: ["farms", id], queryFn: () => farmsApi.getById(id), enabled: !!id });
}
export function useFarmsByFarmer(farmerId: number) {
  return useQuery({ queryKey: ["farms", "farmer", farmerId], queryFn: () => farmsApi.getByFarmer(farmerId), enabled: !!farmerId });
}
export function useCreateFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FarmRequest) => farmsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["farms"] }); toast.success("Farm created"); },
    onError,
  });
}
export function useUpdateFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FarmRequest }) => farmsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["farms"] }); toast.success("Farm updated"); },
    onError,
  });
}
export function useDeleteFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => farmsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["farms"] }); toast.success("Farm deleted"); },
    onError,
  });
}

// ============ CROPS ============
export function useCrops() {
  return useQuery({ queryKey: ["crops"], queryFn: cropsApi.getAll, staleTime: STATIC_STALE });
}
export function useCreateCrop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CropRequest) => cropsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["crops"] }); toast.success("Crop added"); },
    onError,
  });
}

// ============ SOIL DATA ============
export function useSoilDataByFarm(farmId: number) {
  return useQuery({ queryKey: ["soilData", "farm", farmId], queryFn: () => soilDataApi.getByFarm(farmId), enabled: !!farmId, staleTime: DYNAMIC_STALE });
}
export function useAllSoilData() {
  return useQuery({ queryKey: ["soilData"], queryFn: soilDataApi.getAll, staleTime: DYNAMIC_STALE });
}
export function useFetchSoilData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (farmId: number) => soilDataApi.fetchFromProvider(farmId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["soilData"] }); toast.success("Soil data fetched from provider"); },
    onError,
  });
}

// ============ WEATHER DATA ============
export function useWeatherDataByFarm(farmId: number) {
  return useQuery({ queryKey: ["weatherData", "farm", farmId], queryFn: () => weatherDataApi.getByFarm(farmId), enabled: !!farmId, staleTime: DYNAMIC_STALE });
}
export function useAllWeatherData() {
  return useQuery({ queryKey: ["weatherData"], queryFn: weatherDataApi.getAll, staleTime: DYNAMIC_STALE });
}
export function useFetchWeatherData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (farmId: number) => weatherDataApi.fetchFromProvider(farmId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["weatherData"] }); toast.success("Weather data fetched"); },
    onError,
  });
}

// ============ PREDICTIONS ============
export function useYieldPredictions() {
  return useQuery({ queryKey: ["predictions", "yield"], queryFn: yieldPredictionsApi.getAll, staleTime: DYNAMIC_STALE });
}
export function useYieldPredictionsByFarm(farmId: number) {
  return useQuery({ queryKey: ["predictions", "yield", "farm", farmId], queryFn: () => yieldPredictionsApi.getByFarm(farmId), enabled: !!farmId });
}
export function useCreateYieldPrediction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: YieldPredictionRequest) => yieldPredictionsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["predictions", "yield"] }); toast.success("Yield prediction created"); },
    onError,
  });
}

export function usePestPredictions() {
  return useQuery({ queryKey: ["predictions", "pest"], queryFn: pestDiseasePredictionsApi.getAll, staleTime: DYNAMIC_STALE });
}
export function usePestPredictionsByFarm(farmId: number) {
  return useQuery({ queryKey: ["predictions", "pest", "farm", farmId], queryFn: () => pestDiseasePredictionsApi.getByFarm(farmId), enabled: !!farmId });
}

export function useRiskAssessments() {
  return useQuery({ queryKey: ["predictions", "risk"], queryFn: riskAssessmentsApi.getAll, staleTime: DYNAMIC_STALE });
}
export function useRiskAssessmentsByFarm(farmId: number) {
  return useQuery({ queryKey: ["predictions", "risk", "farm", farmId], queryFn: () => riskAssessmentsApi.getByFarm(farmId), enabled: !!farmId });
}

export function useMarketPredictions() {
  return useQuery({ queryKey: ["predictions", "market"], queryFn: marketPredictionsApi.getAll, staleTime: DYNAMIC_STALE });
}

export function useAdaptiveRecommendations() {
  return useQuery({ queryKey: ["predictions", "adaptive"], queryFn: adaptiveRecommendationsApi.getAll, staleTime: DYNAMIC_STALE });
}

export function useCropSuitabilityByFarm(farmId: number) {
  return useQuery({ queryKey: ["predictions", "suitability", "farm", farmId], queryFn: () => cropSuitabilityApi.getByFarm(farmId), enabled: !!farmId });
}

// ============ FEEDBACK ============
export function useFeedback() {
  return useQuery({ queryKey: ["feedback"], queryFn: feedbackApi.getAll, staleTime: DYNAMIC_STALE });
}
export function useCreateFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FarmerFeedbackRequest) => feedbackApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["feedback"] }); toast.success("Feedback submitted"); },
    onError,
  });
}

// ============ DASHBOARD ============
export function useDashboardByFarm(farmId: number) {
  return useQuery({ queryKey: ["dashboard", "farm", farmId], queryFn: () => dashboardApi.getByFarm(farmId), enabled: !!farmId, staleTime: DYNAMIC_STALE });
}
export function useLatestDashboard(farmId: number) {
  return useQuery({ queryKey: ["dashboard", "farm", farmId, "latest"], queryFn: () => dashboardApi.getLatestByFarm(farmId), enabled: !!farmId, staleTime: DYNAMIC_STALE });
}
