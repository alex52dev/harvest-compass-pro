import { ApiResponse, ApiErrorResponse } from "@/types/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.status = error.status;
    this.fieldErrors = error.fieldErrors;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({
      status: res.status,
      message: res.statusText,
      timestamp: new Date().toISOString(),
    }));
    throw new ApiError(errorBody as ApiErrorResponse);
  }

  const body: ApiResponse<T> = await res.json();
  return body.data;
}

// Generic CRUD factory
function createCrudApi<TResponse, TRequest>(basePath: string) {
  return {
    getAll: () => request<TResponse[]>(basePath),
    getById: (id: number) => request<TResponse>(`${basePath}/${id}`),
    create: (data: TRequest) =>
      request<TResponse>(basePath, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: TRequest) =>
      request<TResponse>(`${basePath}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<void>(`${basePath}/${id}`, { method: "DELETE" }),
  };
}

// Resource APIs
export const farmersApi = {
  ...createCrudApi<
    import("@/types/api").FarmerResponse,
    import("@/types/api").FarmerRequest
  >("/farmers"),
  getByLanguage: (lang: string) =>
    request<import("@/types/api").FarmerResponse[]>(`/farmers/language/${lang}`),
  getByLocation: (loc: string) =>
    request<import("@/types/api").FarmerResponse[]>(`/farmers/location/${encodeURIComponent(loc)}`),
};

export const farmsApi = {
  ...createCrudApi<
    import("@/types/api").FarmResponse,
    import("@/types/api").FarmRequest
  >("/farms"),
  getByFarmer: (farmerId: number) =>
    request<import("@/types/api").FarmResponse[]>(`/farms/farmer/${farmerId}`),
};

export const cropsApi = {
  ...createCrudApi<
    import("@/types/api").CropResponse,
    import("@/types/api").CropRequest
  >("/crops"),
  getByCategory: (cat: string) =>
    request<import("@/types/api").CropResponse[]>(`/crops/category/${cat}`),
};

export const soilDataApi = {
  ...createCrudApi<
    import("@/types/api").SoilDataResponse,
    import("@/types/api").SoilDataRequest
  >("/soil-data"),
  getByFarm: (farmId: number) =>
    request<import("@/types/api").SoilDataResponse[]>(`/soil-data/farm/${farmId}`),
  fetchFromProvider: (farmId: number) =>
    request<import("@/types/api").SoilDataResponse>(`/soil-data/fetch/${farmId}`, { method: "POST" }),
};

export const weatherDataApi = {
  ...createCrudApi<
    import("@/types/api").WeatherDataResponse,
    import("@/types/api").WeatherDataRequest
  >("/weather-data"),
  getByFarm: (farmId: number) =>
    request<import("@/types/api").WeatherDataResponse[]>(`/weather-data/farm/${farmId}`),
  fetchFromProvider: (farmId: number) =>
    request<import("@/types/api").WeatherDataResponse>(`/weather-data/fetch/${farmId}`, { method: "POST" }),
};

export const yieldPredictionsApi = {
  ...createCrudApi<
    import("@/types/api").YieldPredictionResponse,
    import("@/types/api").YieldPredictionRequest
  >("/predictions/yield"),
  getByFarm: (farmId: number) =>
    request<import("@/types/api").YieldPredictionResponse[]>(`/predictions/yield/farm/${farmId}`),
};

export const pestDiseasePredictionsApi = {
  ...createCrudApi<
    import("@/types/api").PestDiseasePredictionResponse,
    import("@/types/api").PestDiseasePredictionRequest
  >("/predictions/pest-disease"),
  getByFarm: (farmId: number) =>
    request<import("@/types/api").PestDiseasePredictionResponse[]>(`/predictions/pest-disease/farm/${farmId}`),
};

export const riskAssessmentsApi = {
  ...createCrudApi<
    import("@/types/api").RiskAssessmentResponse,
    import("@/types/api").RiskAssessmentRequest
  >("/predictions/risk"),
  getByFarm: (farmId: number) =>
    request<import("@/types/api").RiskAssessmentResponse[]>(`/predictions/risk/farm/${farmId}`),
};

export const adaptiveRecommendationsApi = {
  ...createCrudApi<
    import("@/types/api").AdaptiveRecommendationResponse,
    import("@/types/api").AdaptiveRecommendationRequest
  >("/predictions/adaptive-recommendations"),
  getByFarm: (farmId: number) =>
    request<import("@/types/api").AdaptiveRecommendationResponse[]>(`/predictions/adaptive-recommendations/farm/${farmId}`),
};

export const cropSuitabilityApi = {
  ...createCrudApi<
    import("@/types/api").CropSuitabilityResultResponse,
    import("@/types/api").CropSuitabilityResultRequest
  >("/predictions/crop-suitability"),
  getByFarm: (farmId: number) =>
    request<import("@/types/api").CropSuitabilityResultResponse[]>(`/predictions/crop-suitability/farm/${farmId}`),
  getLatestByFarm: (farmId: number) =>
    request<import("@/types/api").CropSuitabilityResultResponse>(`/predictions/crop-suitability/farm/${farmId}/latest`),
};

export const marketPredictionsApi = {
  ...createCrudApi<
    import("@/types/api").MarketPredictionResponse,
    import("@/types/api").MarketPredictionRequest
  >("/predictions/market"),
  getByCrop: (cropId: number) =>
    request<import("@/types/api").MarketPredictionResponse[]>(`/predictions/market/crop/${cropId}`),
};

export const feedbackApi = {
  ...createCrudApi<
    import("@/types/api").FarmerFeedbackResponse,
    import("@/types/api").FarmerFeedbackRequest
  >("/feedback"),
  getByFarm: (farmId: number) =>
    request<import("@/types/api").FarmerFeedbackResponse[]>(`/feedback/farm/${farmId}`),
};

export const dashboardApi = {
  ...createCrudApi<
    import("@/types/api").DashboardOutputResponse,
    import("@/types/api").DashboardOutputRequest
  >("/dashboard-outputs"),
  getByFarm: (farmId: number) =>
    request<import("@/types/api").DashboardOutputResponse[]>(`/dashboard-outputs/farm/${farmId}`),
  getLatestByFarm: (farmId: number) =>
    request<import("@/types/api").DashboardOutputResponse>(`/dashboard-outputs/farm/${farmId}/latest`),
};

export { ApiError };
