import { ApiService } from "./api-service"
import type { MaintenanceTask, MaintenanceTaskFilter, MaintenanceTaskCreate } from "../types/maintenance"

class MaintenanceService extends ApiService {
  private readonly MAINTENANCE_ENDPOINT = "/maintenance"

  // Récupérer la liste des tâches de maintenance avec pagination et filtres
  async getTasks(
    filters: MaintenanceTaskFilter = {},
  ): Promise<{ data: MaintenanceTask[]; total: number; page: number; size: number }> {
    try {
      const queryParams = new URLSearchParams()

      if (filters.status) queryParams.append("status", filters.status)
      if (filters.priority) queryParams.append("priority", filters.priority)
      if (filters.assignedTo) queryParams.append("assignedTo", filters.assignedTo)
      if (filters.stationId) queryParams.append("stationId", filters.stationId)
      if (filters.startDate) queryParams.append("startDate", filters.startDate.toISOString())
      if (filters.endDate) queryParams.append("endDate", filters.endDate.toISOString())
      queryParams.append("page", (filters.page || 1).toString())
      queryParams.append("size", (filters.size || 10).toString())

      return await this.get<{ data: MaintenanceTask[]; total: number; page: number; size: number }>(
        `${this.MAINTENANCE_ENDPOINT}/tasks?${queryParams.toString()}`,
      )
    } catch (error) {
      console.error("Failed to get maintenance tasks:", error)
      throw error
    }
  }

  // Créer une nouvelle tâche de maintenance
  async createTask(task: MaintenanceTaskCreate): Promise<MaintenanceTask> {
    try {
      return await this.post<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks`, task)
    } catch (error) {
      console.error("Failed to create maintenance task:", error)
      throw error
    }
  }

  // Récupérer une tâche de maintenance par son ID
  async getTaskById(taskId: string): Promise<MaintenanceTask> {
    try {
      return await this.get<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks/${taskId}`)
    } catch (error) {
      console.error(`Failed to get maintenance task ${taskId}:`, error)
      throw error
    }
  }

  // Mettre à jour une tâche de maintenance
  async updateTask(taskId: string, updates: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
    try {
      return await this.put<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks/${taskId}`, updates)
    } catch (error) {
      console.error(`Failed to update maintenance task ${taskId}:`, error)
      throw error
    }
  }

  // Marquer une tâche comme terminée
  async completeTask(taskId: string, notes?: string): Promise<MaintenanceTask> {
    try {
      return await this.post<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks/${taskId}/complete`, { notes })
    } catch (error) {
      console.error(`Failed to complete maintenance task ${taskId}:`, error)
      throw error
    }
  }

  // Assigner une tâche à un technicien
  async assignTask(taskId: string, technicianId: string): Promise<MaintenanceTask> {
    try {
      return await this.post<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks/${taskId}/assign`, { technicianId })
    } catch (error) {
      console.error(`Failed to assign maintenance task ${taskId}:`, error)
      throw error
    }
  }

  // Récupérer les statistiques de maintenance
  async getMaintenanceStats(stationId?: string): Promise<any> {
    try {
      const queryParams = new URLSearchParams()
      if (stationId) queryParams.append("stationId", stationId)

      return await this.get<any>(`${this.MAINTENANCE_ENDPOINT}/stats?${queryParams.toString()}`)
    } catch (error) {
      console.error("Failed to get maintenance statistics:", error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const maintenanceService = new MaintenanceService()
