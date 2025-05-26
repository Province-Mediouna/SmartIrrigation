import { ApiService } from "./api-service"
import type { Report, ReportFilter, ReportCreate } from "../types/report"

class ReportsService extends ApiService {
  private readonly REPORTS_ENDPOINT = "/reports"

  // Récupérer les rapports avec pagination et filtres
  async getReports(filters: ReportFilter = {}): Promise<{ data: Report[]; total: number; page: number; size: number }> {
    try {
      const queryParams = new URLSearchParams()

      if (filters.type) queryParams.append("type", filters.type)
      if (filters.startDate) queryParams.append("startDate", filters.startDate.toISOString())
      if (filters.endDate) queryParams.append("endDate", filters.endDate.toISOString())
      if (filters.createdBy) queryParams.append("createdBy", filters.createdBy)
      queryParams.append("page", (filters.page || 1).toString())
      queryParams.append("size", (filters.size || 10).toString())

      return await this.get<{ data: Report[]; total: number; page: number; size: number }>(
        `${this.REPORTS_ENDPOINT}?${queryParams.toString()}`,
      )
    } catch (error) {
      console.error("Failed to get reports:", error)
      throw error
    }
  }

  // Créer un nouveau rapport
  async createReport(report: ReportCreate): Promise<Report> {
    try {
      return await this.post<Report>(`${this.REPORTS_ENDPOINT}`, report)
    } catch (error) {
      console.error("Failed to create report:", error)
      throw error
    }
  }

  // Récupérer un rapport par son ID
  async getReportById(reportId: string): Promise<Report> {
    try {
      return await this.get<Report>(`${this.REPORTS_ENDPOINT}/${reportId}`)
    } catch (error) {
      console.error(`Failed to get report ${reportId}:`, error)
      throw error
    }
  }

  // Télécharger un rapport
  async downloadReport(reportId: string): Promise<Blob> {
    try {
      const response = await this.api.get(`${this.REPORTS_ENDPOINT}/${reportId}/download`, {
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      console.error(`Failed to download report ${reportId}:`, error)
      throw error
    }
  }

  // Générer un rapport personnalisé
  async generateCustomReport(
    type: string,
    startDate: Date,
    endDate: Date,
    filters: Record<string, any> = {},
  ): Promise<Report> {
    try {
      return await this.post<Report>(`${this.REPORTS_ENDPOINT}/generate`, {
        type,
        startDate,
        endDate,
        filters,
      })
    } catch (error) {
      console.error("Failed to generate custom report:", error)
      throw error
    }
  }

  // Planifier un rapport récurrent
  async scheduleReport(
    type: string,
    frequency: "daily" | "weekly" | "monthly",
    recipients: string[],
    filters: Record<string, any> = {},
  ): Promise<{ scheduleId: string }> {
    try {
      return await this.post<{ scheduleId: string }>(`${this.REPORTS_ENDPOINT}/schedule`, {
        type,
        frequency,
        recipients,
        filters,
      })
    } catch (error) {
      console.error("Failed to schedule report:", error)
      throw error
    }
  }

  // Annuler un rapport planifié
  async cancelScheduledReport(scheduleId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.REPORTS_ENDPOINT}/schedule/${scheduleId}`)
    } catch (error) {
      console.error(`Failed to cancel scheduled report ${scheduleId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const reportsService = new ReportsService()
