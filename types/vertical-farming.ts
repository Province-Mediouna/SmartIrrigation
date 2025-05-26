export type VerticalFarmingTechnology = "HYDROPONIC" | "AEROPONIC" | "SUBSTRATE"

export interface LightSpectrum {
  red: number
  blue: number
  green?: number
  farRed?: number
  uv?: number
  intensity: number
}

export interface Photoperiod {
  hoursOn: number
  cycleStart: string
  cycleEnd: string
  transitions?: Array<{
    time: string
    intensity: number
    spectrum?: Partial<LightSpectrum>
  }>
}

export interface NutrientDelivery {
  type: "CONTINUOUS" | "INTERVAL" | "ADAPTIVE"
  ph: number
  ec: number
  temperature: number
  schedule?: Array<{
    time: string
    duration: number
    nutrients: Record<string, number>
  }>
}

export interface VerticalMonitoring {
  sensors: Array<{
    type: string
    location: string
    frequency: number
  }>
  alerts: Array<{
    parameter: string
    condition: string
    threshold: number
    severity: "LOW" | "MEDIUM" | "HIGH"
  }>
}

export interface LightingSystem {
  type: "LED" | "HPS" | "HYBRID"
  spectrum: LightSpectrum
  intensity: number
  photoperiod: Photoperiod
  energyEfficiency: number
}

export interface VerticalSystem {
  id: string
  name: string
  layers: number
  technology: VerticalFarmingTechnology
  totalCapacity: number
  lightingSystem: LightingSystem
  nutrientDelivery: NutrientDelivery
  monitoring: VerticalMonitoring
  crops: string[]
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE"
  createdAt: string
  updatedAt: string
}

export interface CultureLayer {
  id: string
  systemId: string
  level: number
  cropId: string
  cropName: string
  plantingDate: string
  harvestDate?: string
  status: "EMPTY" | "PLANTED" | "GROWING" | "HARVESTING" | "MAINTENANCE"
  customSettings?: {
    lighting?: Partial<LightingSystem>
    nutrients?: Partial<NutrientDelivery>
  }
}

export interface LightingSchedule {
  id: string
  systemId: string
  defaultPhotoperiod: Photoperiod
  layerOverrides?: Array<{
    layerId: string
    photoperiod: Photoperiod
  }>
  energySavingMode?: {
    active: boolean
    settings: {
      peakHoursReduction: number
      minimumIntensity: number
    }
  }
  createdAt: string
  updatedAt: string
}
