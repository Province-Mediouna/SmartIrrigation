export interface FishSpecies {
  id: string
  name: string
  scientificName: string
  optimalTemperature: {
    min: number
    max: number
  }
  optimalPh: {
    min: number
    max: number
  }
  feedingRate: number
  growthRate: number
  density: number
}

export interface PlantType {
  id: string
  name: string
  nutrientRequirements: Record<string, number>
  growthPeriod: number
  spacing: number
  compatibleFish: string[]
}

export interface Filtration {
  type: "MECHANICAL" | "BIOLOGICAL" | "COMBINED"
  capacity: number
  efficiency: number
}

export interface Oxygenation {
  type: "DIFFUSER" | "WATERFALL" | "VENTURI"
  capacity: number
  backupSystem?: boolean
}

export interface WaterCirculation {
  flowRate: number
  pumpEfficiency: number
  filtration: Filtration
  oxygenation: Oxygenation
}

export interface Biofilter {
  type: string
  volume: number
  mediaType: string
  surfaceArea: number
  efficiency: number
}

export interface AquaponicMonitoring {
  parameters: string[]
  frequency: number
  automatedControls: string[]
  alerts: Array<{
    parameter: string
    condition: string
    threshold: number
  }>
}

export interface AquaponicSystem {
  id: string
  name: string
  fishSpecies: FishSpecies[]
  plantTypes: PlantType[]
  waterCirculation: WaterCirculation
  biofilter: Biofilter
  monitoring: AquaponicMonitoring
  capacity: {
    fishTankVolume: number
    growBedArea: number
  }
  status: "ACTIVE" | "MAINTENANCE" | "SETUP" | "INACTIVE"
  createdAt: string
  updatedAt: string
}

export interface FishMonitoring {
  systemId: string
  timestamp: string
  population: number
  averageWeight: number
  feedingRate: number
  mortality: number
  behavior: "NORMAL" | "STRESSED" | "LETHARGIC"
  healthIssues?: string[]
  notes?: string
}

export interface WaterQualityMonitoring {
  systemId: string
  timestamp: string
  temperature: number
  ph: number
  dissolvedOxygen: number
  ammonia: number
  nitrite: number
  nitrate: number
  turbidity?: number
  conductivity?: number
  alkalinity?: number
  hardness?: number
  notes?: string
}
