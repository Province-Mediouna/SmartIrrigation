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
}
