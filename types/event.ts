export interface Event {
  id: string
  type: string
  severity: "info" | "warning" | "error" | "critical"
  title: string
  description: string
  timestamp: string
  read: boolean
  source: {
    type: string
    id: string
  }
  metadata?: Record<string, any>
  relatedEvents?: string[]
}

export interface EventFilter {
  type?: string
  severity?: string
  startDate?: Date
  endDate?: Date
  stationId?: string
  parcelId?: string
  read?: boolean
  page?: number
  size?: number
}

export interface EventSubscription {
  userId: string
  channels: ("email" | "sms" | "push" | "in_app")[]
  filters: {
    types?: string[]
    severities?: ("info" | "warning" | "error" | "critical")[]
    sources?: {
      type: string
      id?: string
    }[]
  }
  schedule?: {
    frequency: "realtime" | "hourly" | "daily" | "weekly"
    timeOfDay?: string // Format HH:MM pour daily et weekly
    dayOfWeek?: number // 0-6 pour weekly (0 = dimanche)
  }
}
