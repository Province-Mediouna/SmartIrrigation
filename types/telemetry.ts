export interface TelemetryHealth {
  systemStatus: string
  batteryAvg: number
  signalStrength: number
  activeStations: number
  totalStations: number
  lastUpdate: string
}
export interface StationError {
  code: string
  message: string
  timestamp: string
}

export interface StationHealth {
  batteryLevel: number
  signalStrength: number
  lastSync: string
  sensorStatus: Record<string, any>
  errors: StationError[]
}
export interface TelemetryMetric {
  timestamp: string
  value: number
  unit: string
}
export interface TelemetryFilter {
  startDate?: Date
  endDate?: Date
  page?: number
  size?: number
}
