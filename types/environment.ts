export interface SoilData {
  id: string
  parcelId: string
  timestamp: string
  moisture: number
  temperature: number
  ph: number
  nutrients: {
    nitrogen: number
    phosphorus: number
    potassium: number
    calcium?: number
    magnesium?: number
    sulfur?: number
  }
  organicMatter: number
  texture: {
    sand: number
    silt: number
    clay: number
    type: string
  }
  salinity?: number
  compaction?: number
  depth?: number
}

export interface BiodiversityIndicator {
  id: string
  parcelId: string
  timestamp: string
  indicator: string
  value: number
  unit: string
  status: "POOR" | "FAIR" | "GOOD" | "EXCELLENT"
  trend: "IMPROVING" | "STABLE" | "DECLINING"
  notes?: string
}

export interface EnvironmentalImpact {
  id: string
  parcelId: string
  timestamp: string
  waterUsage: {
    total: number
    efficiency: number
    impact: "LOW" | "MEDIUM" | "HIGH"
  }
  carbonFootprint: {
    total: number
    sources: Record<string, number>
    impact: "LOW" | "MEDIUM" | "HIGH"
  }
  biodiversity: {
    score: number
    impact: "POSITIVE" | "NEUTRAL" | "NEGATIVE"
  }
  soilHealth: {
    score: number
    impact: "POSITIVE" | "NEUTRAL" | "NEGATIVE"
  }
  chemicalUse: {
    total: number
    toxicity: number
    impact: "LOW" | "MEDIUM" | "HIGH"
  }
  overallScore: number
  recommendations: string[]
}
