export type PollinationType = "MECHANICAL" | "ROBOTIC" | "INSECT_MANAGED"

export interface Coverage {
  area: number
  efficiency: number
  pattern: "GRID" | "RANDOM" | "TARGETED"
}

export interface PollinationEvent {
  time: string
  duration: number
  intensity: number
  coverage: number
}

export interface EnvironmentalConditions {
  temperature: {
    min: number
    max: number
    optimal: number
  }
  humidity: {
    min: number
    max: number
    optimal: number
  }
  light: {
    required: boolean
    intensity?: number
  }
  wind: {
    maxSpeed: number
  }
}

export interface PollinationMonitoring {
  metrics: string[]
  frequency: number
  successIndicators: string[]
}

export interface PollinationSystem {
  id: string
  type: PollinationType
  coverage: Coverage
  schedule?: PollinationSchedule
  effectiveness: number
  monitoring: PollinationMonitoring
  targetCrops: string[]
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE"
  createdAt: string
  updatedAt: string
}

export interface PollinationSchedule {
  id: string
  systemId: string
  timing: PollinationEvent[]
  coverage: number
  efficiency: number
  environmentalConditions: EnvironmentalConditions
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  createdAt: string
  updatedAt: string
}
