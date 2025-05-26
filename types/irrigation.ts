export interface IrrigationZone {
  id: string
  name: string
  status: "active" | "inactive" | "error"
  parcelId: string
  area: number
  soilType: string
  irrigationSystem: string
  moisture: number
  nextSchedule?: string
  lastIrrigation?: string
  waterUsage: number
  efficiency: number
  sensors: IrrigationSensor[]
}

export interface IrrigationSensor {
  id: string
  type: string
  status: "active" | "inactive" | "error"
  value: number
  unit: string
  lastCalibration?: string
}

export interface IrrigationSchedule {
  id: string
  zoneId: string
  startTime: string
  endTime?: string
  duration: number
  daysOfWeek: number[]
  isActive: boolean
  isOptimized: boolean
  waterAmount?: number
  priority: number
  createdAt: string
  updatedAt: string
}

export interface IrrigationEvent {
  id: string
  zoneId: string
  startTime: string
  endTime?: string
  duration: number
  waterUsage: number
  type: "scheduled" | "manual" | "automatic" | "emergency"
  status: "completed" | "in_progress" | "cancelled" | "failed"
  initiatedBy?: string
  notes?: string
}

export interface OptimizationRequest {
  startDate: string
  endDate: string
  constraints: {
    waterSavingTarget?: number
    useWeatherForecast?: boolean
    useSoilMoisture?: boolean
    useCropType?: boolean
    priorityZones?: string[]
  }
}
