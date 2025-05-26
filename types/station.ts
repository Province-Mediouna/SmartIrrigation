export interface Station {
  id: string
  name: string
  status: "online" | "offline" | "warning"
  location: {
    latitude: number
    longitude: number
    altitude?: number
    address?: string
  }
  batteryLevel: number
  signalStrength: number
  firmwareVersion: string
  lastUpdate: string
  sensors: StationSensor[]
  type: string
  installationDate: string
  maintenanceDate?: string
}

export interface  StationStatus {
  id: string
  status: "online" | "offline" | "warning"
  lastUpdate: string
  sensors: StationSensor[]
}

export interface StationSensor {
  id: string
  type: string
  status: "active" | "inactive" | "error"
  lastCalibration?: string
  accuracy?: number
  unit?: string
}

export interface StationTelemetry {
  timestamp: string
  temperature?: number
  humidity?: number
  pressure?: number
  rainfall?: number
  windSpeed?: number
  windDirection?: number
  soilMoisture?: number
  soilTemperature?: number
  batteryLevel: number
  signalStrength: number
}

export interface FirmwareUpdate {
  version: string
  forceUpdate?: boolean
  scheduledTime?: string
}
