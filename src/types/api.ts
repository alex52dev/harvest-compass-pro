// HarvesterAI API Types - aligned to backend DTOs

// ============ ENUMS ============

export enum Language {
  ENGLISH = "ENGLISH",
  ISIZULU = "ISIZULU",
  ISIXHOSA = "ISIXHOSA",
  AFRIKAANS = "AFRIKAANS",
}

export enum LiteracyLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum SoilType {
  CLAY = "CLAY",
  SANDY = "SANDY",
  LOAM = "LOAM",
  SILT = "SILT",
  PEAT = "PEAT",
  CHALK = "CHALK",
  SILTY_CLAY = "SILTY_CLAY",
  SANDY_LOAM = "SANDY_LOAM",
}

export enum IrrigationMethod {
  DRIP = "DRIP",
  SPRINKLER = "SPRINKLER",
  FLOOD = "FLOOD",
  FURROW = "FURROW",
  SUBSURFACE = "SUBSURFACE",
  RAIN_FED = "RAIN_FED",
}

export enum CropCategory {
  GRAIN = "GRAIN",
  VEGETABLE = "VEGETABLE",
  FRUIT = "FRUIT",
  LEGUME = "LEGUME",
  ROOT = "ROOT",
  OILSEED = "OILSEED",
  FIBER = "FIBER",
  FORAGE = "FORAGE",
}

export enum FertilityLevel {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}

export enum WeatherDataType {
  HISTORICAL = "HISTORICAL",
  FORECAST = "FORECAST",
}

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  SEVERE = "SEVERE",
}

export enum OverallRiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum RecommendationType {
  CROP_SWAP = "CROP_SWAP",
  INTERVENTION = "INTERVENTION",
  PLANTING_ADJUSTMENT = "PLANTING_ADJUSTMENT",
  IRRIGATION_CHANGE = "IRRIGATION_CHANGE",
  FERTILIZER_APPLICATION = "FERTILIZER_APPLICATION",
  PEST_CONTROL = "PEST_CONTROL",
  HARVEST_TIMING = "HARVEST_TIMING",
}

export enum SupplyLevel {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}

export enum DemandLevel {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}

// ============ API RESPONSE ============

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
  timestamp: string;
}

// ============ RESPONSE DTOs ============

export interface FarmerResponse {
  farmerId: number;
  name: string;
  language: Language;
  literacyLevel?: LiteracyLevel;
  contactNumber?: string;
  location: string;
}

export interface FarmResponse {
  farmId: number;
  farmerId: number;
  location: string;
  sizeInHectares?: number;
  soilType?: SoilType;
  irrigationMethod?: IrrigationMethod;
  currentCrops?: string[];
  financialGoals?: string;
  notes?: string;
  images?: string[];
}

export interface CropResponse {
  cropId: number;
  name: string;
  category?: CropCategory;
  typicalYieldPerHectare?: number;
  growthDurationDays?: number;
}

export interface SoilDataResponse {
  soilDataId: number;
  farmId: number;
  pH?: number;
  nitrogenLevel?: number;
  phosphorusLevel?: number;
  potassiumLevel?: number;
  organicCarbon?: number;
  sandContent?: number;
  siltContent?: number;
  clayContent?: number;
  fertilityLevel?: FertilityLevel;
  source: string;
  fetchedAt: string;
}

export interface WeatherDataResponse {
  weatherDataId: number;
  farmId: number;
  temperatureCelsius?: number;
  rainfallMm?: number;
  humidityPercent?: number;
  windSpeedKmh?: number;
  forecastDate: string;
  dataType: WeatherDataType;
  source: string;
  fetchedAt: string;
}

export interface YieldPredictionResponse {
  predictionId: number;
  farmId: number;
  cropId: number;
  expectedYieldTons: number;
  expectedProfitZAR?: number;
  generatedAt: string;
}

export interface PestDiseasePredictionResponse {
  predictionId: number;
  farmId: number;
  cropId: number;
  riskLevel: RiskLevel;
  pestOrDiseaseType: string;
  probability?: number;
  recommendedAction?: string;
  generatedAt: string;
}

export interface RiskAssessmentResponse {
  riskId: number;
  farmId: number;
  droughtProbability: number;
  pestProbability: number;
  marketVolatilityProbability: number;
  overallRiskLevel: OverallRiskLevel;
  generatedAt: string;
}

export interface AdaptiveRecommendationResponse {
  recommendationId: number;
  farmId: number;
  cropId?: number;
  recommendationType: RecommendationType;
  reason?: string;
  generatedAt: string;
}

export interface CropSuitabilityResultResponse {
  resultId: number;
  farmId: number;
  recommendedCrops: CropResponse[];
  generatedAt: string;
}

export interface MarketPredictionResponse {
  predictionId: number;
  cropId: number;
  region: string;
  predictedPriceZAR: number;
  forecastDate: string;
  confidenceScore?: number;
  generatedAt: string;
}

export interface FarmerFeedbackResponse {
  feedbackId: number;
  farmId: number;
  cropId: number;
  actualYieldTons?: number;
  cropPerformanceRating: number;
  notes?: string;
  submittedAt: string;
}

export interface DashboardOutputResponse {
  outputId: number;
  farmId: number;
  recommendedCrops?: CropResponse[];
  predictedYieldTons?: number;
  expectedProfitZAR?: number;
  climateAlerts?: string[];
  pestWarnings?: string[];
  seasonalPlan?: string;
  generatedAt: string;
}

// ============ REQUEST DTOs ============

export interface FarmerRequest {
  name: string;
  language: Language;
  literacyLevel?: LiteracyLevel;
  contactNumber?: string;
  location: string;
}

export interface FarmRequest {
  farmerId: number;
  location: string;
  sizeInHectares?: number;
  soilType?: SoilType;
  irrigationMethod?: IrrigationMethod;
  currentCrops?: string[];
  financialGoals?: string;
  notes?: string;
  images?: string[];
}

export interface CropRequest {
  name: string;
  category?: CropCategory;
  typicalYieldPerHectare?: number;
  growthDurationDays?: number;
}

export interface FarmerFeedbackRequest {
  farmId: number;
  cropId: number;
  actualYieldTons?: number;
  cropPerformanceRating: number;
  notes?: string;
}

export interface YieldPredictionRequest {
  farmId: number;
  cropId: number;
  expectedYieldTons: number;
  expectedProfitZAR?: number;
}

export interface RiskAssessmentRequest {
  farmId: number;
  droughtProbability: number;
  pestProbability: number;
  marketVolatilityProbability: number;
}

export interface PestDiseasePredictionRequest {
  farmId: number;
  cropId: number;
  riskLevel: RiskLevel;
  pestOrDiseaseType: string;
  probability?: number;
  recommendedAction?: string;
}

export interface MarketPredictionRequest {
  cropId: number;
  region: string;
  predictedPriceZAR: number;
  forecastDate: string;
  confidenceScore?: number;
}

export interface AdaptiveRecommendationRequest {
  farmId: number;
  cropId?: number;
  recommendationType: RecommendationType;
  reason: string;
}

export interface SoilDataRequest {
  farmId: number;
  pH?: number;
  nitrogenLevel?: number;
  phosphorusLevel?: number;
  potassiumLevel?: number;
  organicCarbon?: number;
  sandContent?: number;
  siltContent?: number;
  clayContent?: number;
  fertilityLevel?: FertilityLevel;
  source: string;
}

export interface WeatherDataRequest {
  farmId: number;
  temperatureCelsius?: number;
  rainfallMm?: number;
  humidityPercent?: number;
  windSpeedKmh?: number;
  forecastDate: string;
  dataType: WeatherDataType;
  source: string;
}

export interface CropSuitabilityResultRequest {
  farmId: number;
  recommendedCropIds: number[];
}

export interface DashboardOutputRequest {
  farmId: number;
  recommendedCropIds?: number[];
  predictedYieldTons?: number;
  expectedProfitZAR?: number;
  climateAlerts?: string[];
  pestWarnings?: string[];
  seasonalPlan?: string;
}
