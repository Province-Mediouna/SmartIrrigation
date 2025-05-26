export interface Drone {
  id: string
  name: string
  model: string
  serialNumber: string
  status: DroneStatus
  batteryLevel: number
  lastMission?: string
  flightHours: number
  maxFlightTime: number
  range: number
  payload: string[]
  lastMaintenance: string
  nextMaintenance: string
  capabilities: string[]
  maxPayload: number
  sensors: DroneSensor[]
}

export interface DroneDetails extends Drone {
  specifications: DroneSpecifications
  maintenanceHistory: DroneMaintenanceRecord[]
  missions: DroneMission[]
  currentLocation?: GeoLocation
  telemetry?: DroneTelemetry
}

export interface DroneSpecifications {
  dimensions: {
    length: number
    width: number
    height: number
  }
  weight: number
  maxSpeed: number
  maxAltitude: number
  maxWindResistance: number
  cameraResolution?: string
  transmissionRange: number
  operatingTemperature: {
    min: number
    max: number
  }
  waterResistance: boolean
  autonomousCapabilities: string[]
}

export type DroneStatus = "available" | "in_mission" | "charging" | "maintenance" | "offline" | "error"

export interface DroneSensor {
  id: string
  type: string
  model: string
  resolution?: string
  accuracy?: number
  status: "active" | "inactive" | "error"
  lastCalibration?: string
}

export interface DroneMission {
  id: string
  name: string
  droneId: string
  status: "planned" | "in_progress" | "completed" | "cancelled" | "failed"
  startTime?: string
  endTime?: string
  area: {
    type: "polygon" | "rectangle" | "path"
    coordinates: [number, number][]
  }
  altitude: number
  speed: number
  purpose: string
  missionType: "survey" | "treatment" | "mapping" | "health_check"
  imageCount?: number
  coverage?: number
  createdAt: string
  updatedBy: string
  notes?: string
  flightPlan: FlightPlan
  weatherConstraints?: WeatherConstraints
  objectives: string[]
}

export interface FlightPlan {
  id: string
  name: string
  waypoints: Waypoint[]
  speed: number
  altitude: number
  returnToHome: boolean
  avoidanceEnabled: boolean
  gimbalSettings?: GimbalSettings
  cameraSettings?: CameraSettings
  estimatedDuration: number
  estimatedDistance: number
  createdAt: string
  updatedAt: string
}

export interface Waypoint {
  latitude: number
  longitude: number
  altitude: number
  speed?: number
  action?: WaypointAction
  hoverTime?: number
  heading?: number
}

export type WaypointAction = "take_photo" | "start_recording" | "stop_recording" | "spray" | "scan" | "hover" | "none"

export interface GimbalSettings {
  pitch: number
  roll: number
  yaw: number
  mode: "follow" | "fpv" | "free"
}

export interface CameraSettings {
  mode: "photo" | "video" | "timelapse" | "panorama"
  interval?: number
  resolution: string
  format: string
  exposureSettings?: ExposureSettings
}

export interface ExposureSettings {
  iso: number
  shutterSpeed: string
  aperture: string
  whiteBalance: string
}

export interface WeatherConstraints {
  maxWindSpeed: number
  minTemperature: number
  maxTemperature: number
  noRain: boolean
  minVisibility: number
}

export interface DroneImage {
  id: string
  missionId: string
  timestamp: string
  location: {
    latitude: number
    longitude: number
    altitude: number
  }
  url: string
  thumbnail?: string
  type: "rgb" | "multispectral" | "thermal" | "ndvi"
  resolution: number
  metadata?: Record<string, any>
  analysisResults?: Record<string, any>
  fileName: string
  fileSize: number
  width: number
  height: number
  captureSettings?: CameraSettings
}

export interface DroneMaintenanceRecord {
  id: string
  droneId: string
  date: string
  type: "routine" | "repair" | "upgrade" | "inspection"
  description: string
  technician: string
  parts?: string[]
  cost?: number
  notes?: string
  nextMaintenanceDate?: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
}

export interface DroneTelemetry {
  timestamp: string
  batteryLevel: number
  signalStrength: number
  altitude: number
  speed: number
  heading: number
  location: GeoLocation
  gimbalPosition?: {
    pitch: number
    roll: number
    yaw: number
  }
  flightMode: string
  remainingFlightTime: number
  distanceFromHome: number
  sensors: Record<string, number>
  warnings: string[]
}

export interface GeoLocation {
  latitude: number
  longitude: number
  altitude?: number
  accuracy?: number
}

export interface MissionPlan {
  id: string
  name: string
  description?: string
  droneId: string
  flightPlans: FlightPlan[]
  schedule?: {
    startTime: string
    recurrence?: string
  }
  status: "draft" | "scheduled" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface DroneImageAnalysis {
  imageIds: string[]
  analysisType: string
  parameters?: Record<string, any>
}

export interface DroneCommand {
  command:
    | "takeoff"
    | "land"
    | "return_to_home"
    | "move"
    | "hover"
    | "capture_image"
    | "start_recording"
    | "stop_recording"
    | "abort"
  parameters?: Record<string, any>
}
