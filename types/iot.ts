export type DeviceType = "SENSOR" | "ACTUATOR" | "CONTROLLER" | "GATEWAY"

export type DeviceProtocol = "MQTT" | "MODBUS" | "LORAWAN" | "ZIGBEE" | "BLUETOOTH"

export type DeviceStatus = "ONLINE" | "OFFLINE" | "ERROR" | "MAINTENANCE" | "INITIALIZING"

export interface IoTDevice {
  id: string
  name: string
  type: DeviceType
  protocol: DeviceProtocol
  configuration: Record<string, any>
  status: DeviceStatus
  lastHeartbeat: string
  firmwareVersion: string
  batteryLevel?: number
  signalStrength?: number
  location?: {
    latitude: number
    longitude: number
    altitude?: number
  }
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface DeviceCommand {
  command: string
  parameters?: Record<string, any>
  priority?: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
  expiresAt?: string
  callback?: string
}

export interface DeviceConfiguration {
  settings: Record<string, any>
  reportingInterval?: number
  thresholds?: Record<string, any>
  alertSettings?: Record<string, any>
  powerManagement?: Record<string, any>
}

export interface DeviceTelemetry {
  deviceId: string
  timestamp: string
  metrics: Record<string, any>
  status: DeviceStatus
  batteryLevel?: number
  signalStrength?: number
}
