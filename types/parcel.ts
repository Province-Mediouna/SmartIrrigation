export interface Parcel {
  id: string
  name: string
  status: "active" | "inactive"
  area: number
  location: string
  coordinates: {
    latitude: number
    longitude: number
  }
  soilType: string
  cropCount: number
  activeCrops: number
  irrigationZones: number
  waterUsage: number
  irrigationEfficiency: number
  createdAt: string
  description: string
}

export interface Crop {
  id: string
  name: string
  variety: string
  status: "active" | "planned" | "harvested"
  plantingDate: string
  harvestDate: string
  area: number
  yield: number | null
  waterRequirement: number
  growthStage: string | null
  parcelId: string
  cropType: string
  expectedYield?: number
  actualYield?: number
  notes?: string
}

export interface SoilData {
  moisture: number
  temperature: number
  ph: number
  nutrients: {
    nitrogen: number
    phosphorus: number
    potassium: number
    calcium: number
    magnesium: number
  }
  organicMatter: number
  texture: {
    sand: number
    silt: number
    clay: number
  }
  lastUpdated: string
}

export interface ParcelDetails {
  id: string
  name: string
  status: "active" | "inactive"
  area: number
  location: string
  coordinates: {
    latitude: number
    longitude: number
  }
  soilType: string
  cropCount: number
  activeCrops: number
  irrigationZones: number
  waterUsage: number
  irrigationEfficiency: number
  createdAt: string
  description: string
}

export interface CropHistory {
  id: string
  cropId: string
  parcelId: string
  plantingDate: string
  harvestDate: string
  area: number
  yield: number
  waterRequirement: number
  growthStage: string | null
}