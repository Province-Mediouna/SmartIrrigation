export interface Report {
  id: string
  type: string
  title: string
  description: string
  createdAt: string
  createdBy: string
  startDate: string
  endDate: string
  status: "pending" | "processing" | "completed" | "failed"
  fileUrl?: string
  fileSize?: number
  fileType?: string
  parameters?: Record<string, any>
  metadata?: Record<string, any>
}

export interface ReportCreate {
  type: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  parameters?: Record<string, any>
}

export interface ReportFilter {
  type?: string
  startDate?: Date
  endDate?: Date
  createdBy?: string
  status?: string
  page?: number
  size?: number
}

export interface ReportSchedule {
  id: string
  reportType: string
  frequency: "daily" | "weekly" | "monthly"
  recipients: string[]
  parameters: Record<string, any>
  nextExecution: string
  createdBy: string
  createdAt: string
  updatedAt: string
  active: boolean
}
