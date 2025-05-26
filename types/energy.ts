export interface EnergyConsumption {
  id: string
  systemId: string
  systemType: string
  timestamp: string
  consumption: number
  unit: "kWh" | "MJ"
  cost?: number
  source: "GRID" | "SOLAR" | "WIND" | "HYBRID" | "OTHER"
  breakdown?: Record<string, number>
  peakUsage?: boolean
}

export interface EnergyConstraints {
  maxConsumption?: number
  peakHoursAvoidance?: boolean
  renewablePercentage?: number
  budgetLimit?: number
}

export interface OptimizationSchedule {
  periods: Array<{
    start: string
    end: string
    priority: "LOW" | "MEDIUM" | "HIGH"
    maxConsumption?: number
  }>
  recurrence: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM"
  exceptions?: Array<{
    date: string
    schedule?: OptimizationSchedule
  }>
}

export interface EnergyPredictions {
  consumptionForecast: EnergyConsumption[]
  peakPeriods: Array<{
    start: string
    end: string
    estimatedConsumption: number
  }>
  savings: {
    estimated: number
    percentage: number
    breakdown: Record<string, number>
  }
  recommendations: string[]
}

export interface EnergyOptimization {
  id: string
  systemId: string
  optimizationType: "PEAK_SHAVING" | "LOAD_SHIFTING" | "RENEWABLE_INTEGRATION"
  constraints: EnergyConstraints
  schedule: OptimizationSchedule
  predictions: EnergyPredictions
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  createdAt: string
  updatedAt: string
}

export interface SolarIntegration {
  id: string
  systemId: string
  capacity: number
  panelType: string
  location: {
    latitude: number
    longitude: number
    orientation: string
    tilt: number
  }
  estimatedProduction: number
  batteryStorage?: {
    capacity: number
    type: string
  }
  gridConnection: boolean
  status: "PLANNING" | "INSTALLATION" | "ACTIVE" | "MAINTENANCE" | "INACTIVE"
  createdAt: string
  updatedAt: string
}
