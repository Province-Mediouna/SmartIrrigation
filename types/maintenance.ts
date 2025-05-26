export interface MaintenanceTask {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  assignedTo: string | null
  stationId?: string
  parcelId?: string
  deviceId?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  completedAt?: string
  notes?: string
  attachments?: string[]
  estimatedDuration?: number // en minutes
  actualDuration?: number // en minutes
  cost?: number
}

export interface MaintenanceTaskCreate {
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  assignedTo?: string
  stationId?: string
  parcelId?: string
  deviceId?: string
  dueDate?: Date
  estimatedDuration?: number
  notes?: string
  attachments?: string[]
  cost?: number
}

export interface MaintenanceTaskFilter {
  status?: string
  priority?: string
  assignedTo?: string
  stationId?: string
  parcelId?: string
  deviceId?: string
  startDate?: Date
  endDate?: Date
  page?: number
  size?: number
}
