import { ApiService } from "./api-service"
import type { PollinationSystem, PollinationSchedule } from "../types/pollination"

class PollinationService extends ApiService {
  private readonly POLLINATION_ENDPOINT = "/pollination"

  // Systèmes de pollinisation
  async getAllSystems(): Promise<PollinationSystem[]> {
    try {
      return await this.get<PollinationSystem[]>(`${this.POLLINATION_ENDPOINT}/artificial-systems`)
    } catch (error) {
      console.error("Failed to fetch pollination systems:", error)
      throw error
    }
  }

  async getSystemById(systemId: string): Promise<PollinationSystem> {
    try {
      return await this.get<PollinationSystem>(`${this.POLLINATION_ENDPOINT}/artificial-systems/${systemId}`)
    } catch (error) {
      console.error(`Failed to fetch pollination system with ID ${systemId}:`, error)
      throw error
    }
  }

  async createSystem(systemData: Partial<PollinationSystem>): Promise<PollinationSystem> {
    try {
      return await this.post<PollinationSystem>(`${this.POLLINATION_ENDPOINT}/artificial-systems`, systemData)
    } catch (error) {
      console.error("Failed to create pollination system:", error)
      throw error
    }
  }

  async updateSystem(systemId: string, systemData: Partial<PollinationSystem>): Promise<PollinationSystem> {
    try {
      return await this.put<PollinationSystem>(
        `${this.POLLINATION_ENDPOINT}/artificial-systems/${systemId}`,
        systemData,
      )
    } catch (error) {
      console.error(`Failed to update pollination system with ID ${systemId}:`, error)
      throw error
    }
  }

  async deleteSystem(systemId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.POLLINATION_ENDPOINT}/artificial-systems/${systemId}`)
    } catch (error) {
      console.error(`Failed to delete pollination system with ID ${systemId}:`, error)
      throw error
    }
  }

  // Plannings de pollinisation
  async getScheduleBySystem(systemId: string): Promise<PollinationSchedule> {
    try {
      return await this.get<PollinationSchedule>(`${this.POLLINATION_ENDPOINT}/schedules/${systemId}`)
    } catch (error) {
      console.error(`Failed to fetch pollination schedule for system with ID ${systemId}:`, error)
      throw error
    }
  }

  async createSchedule(scheduleData: Partial<PollinationSchedule>): Promise<PollinationSchedule> {
    try {
      return await this.post<PollinationSchedule>(`${this.POLLINATION_ENDPOINT}/schedules`, scheduleData)
    } catch (error) {
      console.error("Failed to create pollination schedule:", error)
      throw error
    }
  }

  async updateSchedule(scheduleId: string, scheduleData: Partial<PollinationSchedule>): Promise<PollinationSchedule> {
    try {
      return await this.put<PollinationSchedule>(`${this.POLLINATION_ENDPOINT}/schedules/${scheduleId}`, scheduleData)
    } catch (error) {
      console.error(`Failed to update pollination schedule with ID ${scheduleId}:`, error)
      throw error
    }
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.POLLINATION_ENDPOINT}/schedules/${scheduleId}`)
    } catch (error) {
      console.error(`Failed to delete pollination schedule with ID ${scheduleId}:`, error)
      throw error
    }
  }

  // Statistiques de pollinisation
  async getPollinationStats(systemId: string): Promise<any> {
    try {
      return await this.get<any>(`${this.POLLINATION_ENDPOINT}/stats/${systemId}`)
    } catch (error) {
      console.error(`Failed to fetch pollination stats for system with ID ${systemId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const pollinationService = new PollinationService()
