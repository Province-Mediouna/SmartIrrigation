export interface SoilDataType {
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

export interface Soil {
  id: string
  name: string
  type: string
  description: string
}