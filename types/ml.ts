export type MLModelType =
  | "WATER_PREDICTION"
  | "DISEASE_DETECTION"
  | "YIELD_PREDICTION"
  | "SOIL_ANALYSIS"
  | "WEATHER_FORECAST"
  | "IRRIGATION_OPTIMIZATION"
  | "CROP_RECOMMENDATION"

export interface MLModel {
  id: string
  name: string
  type: MLModelType
  description: string
  version: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  trainingDataset: string
  validationDataset: string
  parameters: Record<string, any>
  createdAt: string
  updatedAt: string
  status: "TRAINING" | "READY" | "FAILED" | "DEPLOYED"
  deployedAt?: string
}

export interface MLModelTraining {
  modelType: MLModelType
  dataset: string
  parameters?: Record<string, any>
  validationSplit?: number
  callback?: string
  name?: string
  description?: string
}

export interface DiseasePredictionRequest {
  parcelId: string
  images: string[]
  cropType?: string
  confidence?: number
}

export interface DiseasePrediction {
  id: string
  parcelId: string
  timestamp: string
  predictions: Array<{
    disease: string
    confidence: number
    severity?: "LOW" | "MEDIUM" | "HIGH"
    recommendations?: string[]
  }>
  modelId: string
  modelVersion: string
}
