export interface ClimateParameters {
  temperature: {
    day: number
    night: number
    tolerance: number
  }
  humidity: {
    min: number
    max: number
  }
  co2Level?: number
  lightIntensity?: number
}

export interface ClimateRule {
  condition: string
  action: string
  priority: number
}

export interface EnergyEfficiency {
  mode: "STANDARD" | "ECO" | "PERFORMANCE"
  peakAvoidance: boolean
  insulationLevel: number
}

export interface ClimateControl {
  greenhouseId: string
  parameters: ClimateParameters
  automationRules: ClimateRule[]
  energyEfficiency: EnergyEfficiency
  status: "ACTIVE" | "MANUAL" | "MAINTENANCE"
  createdAt: string
  updatedAt: string
}

export interface VentilationControl {
  greenhouseId: string
  mode: "AUTOMATIC" | "MANUAL" | "SCHEDULED"
  settings: {
    minTemperature: number
    maxTemperature: number
    minHumidity: number
    maxHumidity: number
    airExchangeRate: number
  }
  schedule?: Array<{
    time: string
    duration: number
    intensity: number
  }>
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE"
  createdAt: string
  updatedAt: string
}

export interface CO2Management {
  greenhouseId: string
  mode: "AUTOMATIC" | "MANUAL" | "SCHEDULED"
  settings: {
    targetLevel: number
    tolerance: number
    maxLevel: number
    enrichmentRate: number
  }
  schedule?: Array<{
    time: string
    duration: number
    targetLevel: number
  }>
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE"
  createdAt: string
  updatedAt: string
}
