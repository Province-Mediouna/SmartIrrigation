export interface WaterSource {
  id: string
  name: string
  type: "well" | "reservoir" | "river" | "rain" | "municipal" | "other"
  location: {
    latitude: number
    longitude: number
  }
  capacity?: number
  currentLevel?: number
  status: "active" | "inactive" | "maintenance"
  lastUpdate: string
  description?: string
  metadata?: Record<string, any>
}

export interface WaterSourceDetails {
  id: string
  name: string
  type: "well" | "reservoir" | "river" | "rain" | "municipal" | "other"
  location: {
    latitude: number
    longitude: number
    altitude?: number
    address?: string
  }
  capacity?: number
  currentLevel?: number
  status: "active" | "inactive" | "maintenance"
  lastUpdate: string
  description?: string
}

export interface WaterQualityData {
  id: string
  sourceId: string
  timestamp: string
  ph: number
  conductivity?: number
  dissolvedOxygen?: number
  temperature?: number
  turbidity?: number
}

export interface WaterLevelData {
  id: string
  sourceId: string
  timestamp: string
  level: number
}

export interface WaterUsageReport {
  id: string
  sourceId: string
  timestamp: string
  volume: number
  purpose: string
  cost?: number
}

export interface WaterQuality {
  id: string
  sourceId: string
  timestamp: string
  ph: number
  conductivity?: number
  dissolvedOxygen?: number
  temperature?: number
  turbidity?: number
  totalDissolvedSolids?: number
  nitrateLevel?: number
  phosphateLevel?: number
  bacteriaCount?: number
  notes?: string
}

export interface WaterUsage {
  date: string
  source: string
  sourceId: string
  volume: number
  purpose: string
  cost?: number
}
