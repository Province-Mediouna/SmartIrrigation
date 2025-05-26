export interface Alert {
  id: string
  type: string
  severity: "high" | "medium" | "low"
  message: string
  timestamp: string
  source: string
  sourceId?: string
  status: "new" | "read" | "resolved"
  resolvedAt?: string
  resolvedBy?: string
  resolution?: string
  metadata?: Record<string, any>
}
export interface AlertStats {
  totalAlerts: number
  newAlerts: number
  resolvedAlerts: number
}
export type AlertStatus = "new" | "read" | "resolved"
export type AlertType = "drone" | "parcel" | "water-source" | "zone"
export type AlertSeverity = "high" | "medium" | "low"

export interface AlertRule {
  id: string
  name: string
  description: string
  type: string
  condition: {
    parameter: string
    operator: "gt" | "lt" | "eq" | "neq" | "gte" | "lte"
    value: number | string | boolean
  }
  severity: "high" | "medium" | "low"
  isActive: boolean
  notificationChannels: string[]
  cooldownPeriod?: number
  createdAt: string
  updatedAt: string
}
