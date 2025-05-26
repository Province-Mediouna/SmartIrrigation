export type TreatmentType = "PESTICIDE" | "FERTILIZER" | "BIOLOGICAL" | "HERBICIDE" | "FUNGICIDE"

export interface Treatment {
  id: string
  name: string
  type: TreatmentType
  activeIngredients: string[]
  applicationRate: number
  applicationRateUnit: string
  waitingPeriod: number
  environmentalImpact: "LOW" | "MEDIUM" | "HIGH"
  certifications: string[]
  restrictions?: string[]
  safetyInstructions?: string[]
  manufacturer?: string
  registrationNumber?: string
  createdAt: string
  updatedAt: string
}

export interface CompatibilityCheck {
  treatments: string[]
  soilType?: string
  cropType?: string
  temperature?: number
  humidity?: number
}

export interface CompatibilityResult {
  compatible: boolean
  issues?: Array<{
    treatmentId: string
    issue: string
    severity: "LOW" | "MEDIUM" | "HIGH"
    recommendation?: string
  }>
  recommendations?: string[]
}

export interface TreatmentApplication {
  id: string
  treatmentId: string
  parcelId: string
  applicationDate: string
  quantity: number
  quantityUnit: string
  appliedBy: string
  method: string
  weather?: {
    temperature: number
    humidity: number
    windSpeed: number
    precipitation: number
  }
  notes?: string
  effectiveness?: number
  sideEffects?: string[]
}
