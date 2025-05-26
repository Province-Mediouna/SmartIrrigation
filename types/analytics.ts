export type AnalyticsTimeframe = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY" | "CUSTOM"

export interface AnalyticsParameters {
  startDate?: string
  endDate?: string
  parcelIds?: string[]
  zoneIds?: string[]
  cropTypes?: string[]
  groupBy?: string
  includeWeather?: boolean
  includeSoil?: boolean
}

export interface WaterUsageData {
  date: string
  usage: number
  source?: string
  zone?: string
  parcel?: string
  crop?: string
  efficiency?: number
  rainfall?: number
  temperature?: number
  evapotranspiration?: number
}

export interface YieldPrediction {
  cropId: string
  cropType: string
  parcelId: string
  predictedYield: number
  confidenceInterval: [number, number]
  factors: YieldFactor[]
  harvestDate: string
  comparisonToAverage: number
  potentialImprovement: number
}

export interface YieldFactor {
  name: string
  impact: number
  trend: "INCREASING" | "DECREASING" | "STABLE"
}

export interface SoilHealthData {
  date: string
  parcelId: string
  moisture: number
  organicMatter: number
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  microorganisms?: number
  compaction?: number
  healthIndex: number
}

export interface WeatherPatternData {
  date: string
  temperature: {
    min: number
    max: number
    avg: number
  }
  precipitation: number
  humidity: number
  windSpeed: number
  solarRadiation: number
  evapotranspiration: number
  growingDegreeDays?: number
}

export interface CropComparisonData {
  cropType: string
  waterUsage: number
  yield: number
  cost: number
  revenue: number
  profit: number
  growthDuration: number
  waterEfficiency: number
  soilImpact: number
  pestResistance: number
  diseaseResistance: number
  marketDemand: number
}

export interface EfficiencyMetrics {
  waterUseEfficiency: number
  energyEfficiency: number
  laborEfficiency: number
  costPerUnit: number
  yieldPerHectare: number
  profitMargin: number
  resourceUtilization: number
  sustainability: {
    carbonFootprint: number
    waterConservation: number
    soilHealth: number
    biodiversity: number
  }
  trends: {
    waterUse: Trend
    energy: Trend
    yield: Trend
    profit: Trend
  }
  benchmarks: {
    industry: number
    regional: number
    historical: number
  }
}

export interface Trend {
  direction: "UP" | "DOWN" | "STABLE"
  percentage: number
  period: string
}

export interface AnalyticsReport {
  id: string
  name: string
  type: string
  createdAt: string
  parameters: AnalyticsParameters
  url: string
  format: "PDF" | "CSV" | "EXCEL"
  size: number
  status: "COMPLETED" | "PROCESSING" | "FAILED"
}
