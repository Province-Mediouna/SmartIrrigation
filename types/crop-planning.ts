export interface CropRotation {
  id: string
  name: string
  crops: Array<{
    cropId: string
    cropName: string
    order: number
    duration: number
    benefits: string[]
  }>
  soilTypes: string[]
  benefits: string[]
  constraints?: string[]
  recommendations?: string[]
}

export interface RotationPlan {
  id: string
  parcelId: string
  rotations: Array<{
    rotationId: string
    startDate: string
    endDate: string
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  }>
  duration: number
  expectedBenefits: string[]
  soilHealthMetrics?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  region?: string
  weatherConditions?: Record<string, any>
  recommendedCrops?: string[]
  notes?: string
}

export interface CropPlan {
  id: string
  parcelId: string
  cropId: string
  cropName: string
  season: string
  plantingDate: string
  harvestDate: string
  expectedYield: number
  yieldUnit: string
  status: "PLANNED" | "PLANTED" | "GROWING" | "HARVESTED" | "FAILED"
  notes?: string
  treatments?: Array<{
    treatmentId: string
    scheduledDate: string
    status: "PLANNED" | "APPLIED" | "SKIPPED"
  }>
}

export interface CropPlanningFilter {
  page?: number
  size?: number
  soilType?: string
  status?: "active" | "inactive"
  search?: string
  hasCrops?: boolean
  irrigationZones?: number
  cropCount?: number
  efficiency?: {
    min?: number
    max?: number
  }
  waterUsage?: {
    min?: number
    max?: number
  }
  area?: {
    min?: number
    max?: number
  }
}
