import {
  FarmerResponse, FarmResponse, CropResponse, DashboardOutputResponse,
  YieldPredictionResponse, RiskAssessmentResponse, PestDiseasePredictionResponse,
  WeatherDataResponse, SoilDataResponse, FarmerFeedbackResponse,
  MarketPredictionResponse, AdaptiveRecommendationResponse,
  Language, LiteracyLevel, SoilType, IrrigationMethod, CropCategory,
  FertilityLevel, WeatherDataType, RiskLevel, OverallRiskLevel, RecommendationType,
} from "@/types/api";

export const mockFarmers: FarmerResponse[] = [
  { farmerId: 1, name: "Thandi Mokoena", language: Language.ISIZULU, literacyLevel: LiteracyLevel.MEDIUM, contactNumber: "+27711234567", location: "Mpumalanga" },
  { farmerId: 2, name: "Pieter van der Merwe", language: Language.AFRIKAANS, literacyLevel: LiteracyLevel.HIGH, contactNumber: "+27821234567", location: "Western Cape" },
  { farmerId: 3, name: "Nomsa Dlamini", language: Language.ISIXHOSA, literacyLevel: LiteracyLevel.LOW, contactNumber: "+27731234567", location: "Eastern Cape" },
  { farmerId: 4, name: "John Sithole", language: Language.ENGLISH, literacyLevel: LiteracyLevel.HIGH, contactNumber: "+27741234567", location: "KwaZulu-Natal" },
  { farmerId: 5, name: "Aisha Patel", language: Language.ENGLISH, literacyLevel: LiteracyLevel.HIGH, contactNumber: "+27751234567", location: "Gauteng" },
];

export const mockFarms: FarmResponse[] = [
  { farmId: 1, farmerId: 1, location: "Mbombela, Mpumalanga", sizeInHectares: 45, soilType: SoilType.LOAM, irrigationMethod: IrrigationMethod.DRIP, currentCrops: ["Maize", "Sugarcane"], financialGoals: "Increase yield by 20%", notes: "Near river, good water access" },
  { farmId: 2, farmerId: 2, location: "Stellenbosch, Western Cape", sizeInHectares: 120, soilType: SoilType.SANDY_LOAM, irrigationMethod: IrrigationMethod.SPRINKLER, currentCrops: ["Grapes", "Wheat"], financialGoals: "Premium wine grape production" },
  { farmId: 3, farmerId: 3, location: "Mthatha, Eastern Cape", sizeInHectares: 25, soilType: SoilType.CLAY, irrigationMethod: IrrigationMethod.RAIN_FED, currentCrops: ["Cabbage", "Spinach"], financialGoals: "Food security" },
  { farmId: 4, farmerId: 4, location: "Durban North, KwaZulu-Natal", sizeInHectares: 80, soilType: SoilType.SILT, irrigationMethod: IrrigationMethod.FURROW, currentCrops: ["Sugarcane", "Banana"] },
  { farmId: 5, farmerId: 5, location: "Centurion, Gauteng", sizeInHectares: 15, soilType: SoilType.LOAM, irrigationMethod: IrrigationMethod.DRIP, currentCrops: ["Tomatoes", "Peppers"], financialGoals: "Urban farming profitability" },
];

export const mockCrops: CropResponse[] = [
  { cropId: 1, name: "Maize", category: CropCategory.GRAIN, typicalYieldPerHectare: 6.5, growthDurationDays: 120 },
  { cropId: 2, name: "Sugarcane", category: CropCategory.GRAIN, typicalYieldPerHectare: 70, growthDurationDays: 365 },
  { cropId: 3, name: "Wheat", category: CropCategory.GRAIN, typicalYieldPerHectare: 4.2, growthDurationDays: 110 },
  { cropId: 4, name: "Grapes", category: CropCategory.FRUIT, typicalYieldPerHectare: 12, growthDurationDays: 180 },
  { cropId: 5, name: "Cabbage", category: CropCategory.VEGETABLE, typicalYieldPerHectare: 40, growthDurationDays: 80 },
  { cropId: 6, name: "Spinach", category: CropCategory.VEGETABLE, typicalYieldPerHectare: 15, growthDurationDays: 45 },
  { cropId: 7, name: "Tomatoes", category: CropCategory.VEGETABLE, typicalYieldPerHectare: 50, growthDurationDays: 90 },
  { cropId: 8, name: "Soybeans", category: CropCategory.LEGUME, typicalYieldPerHectare: 2.8, growthDurationDays: 100 },
  { cropId: 9, name: "Sunflower", category: CropCategory.OILSEED, typicalYieldPerHectare: 1.8, growthDurationDays: 95 },
  { cropId: 10, name: "Banana", category: CropCategory.FRUIT, typicalYieldPerHectare: 30, growthDurationDays: 300 },
];

export const mockDashboard: DashboardOutputResponse = {
  outputId: 1,
  farmId: 1,
  recommendedCrops: [mockCrops[0], mockCrops[7]],
  predictedYieldTons: 292.5,
  expectedProfitZAR: 1450000,
  climateAlerts: ["Drought warning for March–April", "Above-average temperatures expected"],
  pestWarnings: ["Fall armyworm activity detected in region", "Aphid risk elevated for leafy crops"],
  seasonalPlan: "Plant maize early September. Apply pre-emergent herbicide. Schedule irrigation cycles every 3 days during germination.",
  generatedAt: "2026-03-28T08:00:00",
};

export const mockYieldPredictions: YieldPredictionResponse[] = [
  { predictionId: 1, farmId: 1, cropId: 1, expectedYieldTons: 292.5, expectedProfitZAR: 1450000, generatedAt: "2026-03-20T10:00:00" },
  { predictionId: 2, farmId: 1, cropId: 2, expectedYieldTons: 3150, expectedProfitZAR: 2100000, generatedAt: "2026-03-20T10:05:00" },
  { predictionId: 3, farmId: 2, cropId: 4, expectedYieldTons: 1440, expectedProfitZAR: 8500000, generatedAt: "2026-03-21T09:00:00" },
];

export const mockRiskAssessments: RiskAssessmentResponse[] = [
  { riskId: 1, farmId: 1, droughtProbability: 0.65, pestProbability: 0.40, marketVolatilityProbability: 0.25, overallRiskLevel: OverallRiskLevel.MEDIUM, generatedAt: "2026-03-25T12:00:00" },
  { riskId: 2, farmId: 2, droughtProbability: 0.30, pestProbability: 0.15, marketVolatilityProbability: 0.55, overallRiskLevel: OverallRiskLevel.MEDIUM, generatedAt: "2026-03-25T12:05:00" },
  { riskId: 3, farmId: 3, droughtProbability: 0.80, pestProbability: 0.60, marketVolatilityProbability: 0.45, overallRiskLevel: OverallRiskLevel.HIGH, generatedAt: "2026-03-25T12:10:00" },
];

export const mockPestPredictions: PestDiseasePredictionResponse[] = [
  { predictionId: 1, farmId: 1, cropId: 1, riskLevel: RiskLevel.HIGH, pestOrDiseaseType: "Fall Armyworm", probability: 0.72, recommendedAction: "Apply Bt-based biopesticide. Scout fields weekly.", generatedAt: "2026-03-24T08:00:00" },
  { predictionId: 2, farmId: 1, cropId: 2, riskLevel: RiskLevel.MEDIUM, pestOrDiseaseType: "Sugarcane Borer", probability: 0.45, recommendedAction: "Introduce Trichogramma parasitoids.", generatedAt: "2026-03-24T08:05:00" },
  { predictionId: 3, farmId: 3, cropId: 5, riskLevel: RiskLevel.LOW, pestOrDiseaseType: "Aphids", probability: 0.20, recommendedAction: "Monitor. Apply neem oil if threshold reached.", generatedAt: "2026-03-24T08:10:00" },
];

export const mockWeatherData: WeatherDataResponse[] = [
  { weatherDataId: 1, farmId: 1, temperatureCelsius: 28, rainfallMm: 12, humidityPercent: 65, windSpeedKmh: 15, forecastDate: "2026-03-28", dataType: WeatherDataType.FORECAST, source: "OpenWeather", fetchedAt: "2026-03-27T18:00:00" },
  { weatherDataId: 2, farmId: 1, temperatureCelsius: 30, rainfallMm: 0, humidityPercent: 55, windSpeedKmh: 20, forecastDate: "2026-03-29", dataType: WeatherDataType.FORECAST, source: "OpenWeather", fetchedAt: "2026-03-27T18:00:00" },
  { weatherDataId: 3, farmId: 1, temperatureCelsius: 26, rainfallMm: 35, humidityPercent: 80, windSpeedKmh: 10, forecastDate: "2026-03-30", dataType: WeatherDataType.FORECAST, source: "OpenWeather", fetchedAt: "2026-03-27T18:00:00" },
];

export const mockSoilData: SoilDataResponse[] = [
  { soilDataId: 1, farmId: 1, pH: 6.2, nitrogenLevel: 45, phosphorusLevel: 28, potassiumLevel: 180, organicCarbon: 2.1, fertilityLevel: FertilityLevel.MODERATE, source: "SoilGrids", fetchedAt: "2026-03-15T10:00:00" },
  { soilDataId: 2, farmId: 2, pH: 5.8, nitrogenLevel: 55, phosphorusLevel: 35, potassiumLevel: 220, organicCarbon: 3.2, fertilityLevel: FertilityLevel.HIGH, source: "SoilGrids", fetchedAt: "2026-03-15T10:05:00" },
];

export const mockFeedback: FarmerFeedbackResponse[] = [
  { feedbackId: 1, farmId: 1, cropId: 1, actualYieldTons: 280, cropPerformanceRating: 4, notes: "Good season, slightly below prediction due to late rains.", submittedAt: "2026-02-15T14:00:00" },
  { feedbackId: 2, farmId: 2, cropId: 4, actualYieldTons: 1500, cropPerformanceRating: 5, notes: "Excellent vintage year.", submittedAt: "2026-02-20T10:00:00" },
];

export const mockMarketPredictions: MarketPredictionResponse[] = [
  { predictionId: 1, cropId: 1, region: "Mpumalanga", predictedPriceZAR: 4950, forecastDate: "2026-04-01", confidenceScore: 0.82, generatedAt: "2026-03-25T09:00:00" },
  { predictionId: 2, cropId: 4, region: "Western Cape", predictedPriceZAR: 18500, forecastDate: "2026-04-01", confidenceScore: 0.75, generatedAt: "2026-03-25T09:05:00" },
  { predictionId: 3, cropId: 7, region: "Gauteng", predictedPriceZAR: 8200, forecastDate: "2026-04-01", confidenceScore: 0.88, generatedAt: "2026-03-25T09:10:00" },
];

export const mockAdaptiveRecommendations: AdaptiveRecommendationResponse[] = [
  { recommendationId: 1, farmId: 1, cropId: 1, recommendationType: RecommendationType.IRRIGATION_CHANGE, reason: "Switch to deficit irrigation during late vegetative stage to conserve water ahead of predicted drought.", generatedAt: "2026-03-26T07:00:00" },
  { recommendationId: 2, farmId: 1, cropId: 2, recommendationType: RecommendationType.PEST_CONTROL, reason: "Apply biological control agents before borer population peaks in April.", generatedAt: "2026-03-26T07:05:00" },
  { recommendationId: 3, farmId: 3, recommendationType: RecommendationType.CROP_SWAP, reason: "Consider switching from cabbage to drought-tolerant sorghum given current climate projections.", generatedAt: "2026-03-26T07:10:00" },
];
