import { ApiService } from "./api-service"
import type {
  IrrigationZone,
  IrrigationSchedule,
  IrrigationEvent,
  IrrigationSettings,
  OptimizationResult,
} from "../types/irrigation"

class IrrigationService extends ApiService {
  private readonly ZONES_ENDPOINT = "/irrigation/zones"
  private readonly SCHEDULES_ENDPOINT = "/irrigation/schedules"
  private readonly EVENTS_ENDPOINT = "/irrigation/events"
  private readonly SETTINGS_ENDPOINT = "/irrigation/settings"

  // Zones d'irrigation
  async getAllZones(): Promise<IrrigationZone[]> {
    try {
      return await this.get<IrrigationZone[]>(this.ZONES_ENDPOINT)
    } catch (error) {
      console.error("Failed to fetch irrigation zones:", error)
      throw error
    }
  }

  async getZoneById(zoneId: string): Promise<IrrigationZone> {
    try {
      return await this.get<IrrigationZone>(`${this.ZONES_ENDPOINT}/${zoneId}`)
    } catch (error) {
      console.error(`Failed to fetch irrigation zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  async createZone(zoneData: Partial<IrrigationZone>): Promise<IrrigationZone> {
    try {
      return await this.post<IrrigationZone>(this.ZONES_ENDPOINT, zoneData)
    } catch (error) {
      console.error("Failed to create irrigation zone:", error)
      throw error
    }
  }

  async updateZone(zoneId: string, zoneData: Partial<IrrigationZone>): Promise<IrrigationZone> {
    try {
      return await this.put<IrrigationZone>(`${this.ZONES_ENDPOINT}/${zoneId}`, zoneData)
    } catch (error) {
      console.error(`Failed to update irrigation zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  async deleteZone(zoneId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.ZONES_ENDPOINT}/${zoneId}`)
    } catch (error) {
      console.error(`Failed to delete irrigation zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  // Planifications d'irrigation
  async getSchedulesByZone(zoneId: string): Promise<IrrigationSchedule[]> {
    try {
      return await this.get<IrrigationSchedule[]>(`${this.ZONES_ENDPOINT}/${zoneId}/schedules`)
    } catch (error) {
      console.error(`Failed to fetch schedules for zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  async createSchedule(scheduleData: Partial<IrrigationSchedule>): Promise<IrrigationSchedule> {
    try {
      return await this.post<IrrigationSchedule>(this.SCHEDULES_ENDPOINT, scheduleData)
    } catch (error) {
      console.error("Failed to create irrigation schedule:", error)
      throw error
    }
  }

  async updateSchedule(scheduleId: string, scheduleData: Partial<IrrigationSchedule>): Promise<IrrigationSchedule> {
    try {
      return await this.put<IrrigationSchedule>(`${this.SCHEDULES_ENDPOINT}/${scheduleId}`, scheduleData)
    } catch (error) {
      console.error(`Failed to update irrigation schedule with ID ${scheduleId}:`, error)
      throw error
    }
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.SCHEDULES_ENDPOINT}/${scheduleId}`)
    } catch (error) {
      console.error(`Failed to delete irrigation schedule with ID ${scheduleId}:`, error)
      throw error
    }
  }

  // Événements d'irrigation
  async getEventsByZone(zoneId: string, startDate?: Date, endDate?: Date): Promise<IrrigationEvent[]> {
    try {
      const params: Record<string, string> = {}
      if (startDate) params.startDate = startDate.toISOString()
      if (endDate) params.endDate = endDate.toISOString()

      return await this.get<IrrigationEvent[]>(`${this.ZONES_ENDPOINT}/${zoneId}/events`, { params })
    } catch (error) {
      console.error(`Failed to fetch events for zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  async createEvent(eventData: Partial<IrrigationEvent>): Promise<IrrigationEvent> {
    try {
      return await this.post<IrrigationEvent>(this.EVENTS_ENDPOINT, eventData)
    } catch (error) {
      console.error("Failed to create irrigation event:", error)
      throw error
    }
  }

  // Paramètres d'irrigation
  async getSettings(zoneId: string): Promise<IrrigationSettings> {
    try {
      return await this.get<IrrigationSettings>(`${this.ZONES_ENDPOINT}/${zoneId}/settings`)
    } catch (error) {
      console.error(`Failed to fetch settings for zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  async updateSettings(zoneId: string, settingsData: Partial<IrrigationSettings>): Promise<IrrigationSettings> {
    try {
      return await this.put<IrrigationSettings>(`${this.ZONES_ENDPOINT}/${zoneId}/settings`, settingsData)
    } catch (error) {
      console.error(`Failed to update settings for zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  // Optimisation de l'irrigation
  async optimizeSchedule(zoneId: string, parameters?: Record<string, any>): Promise<OptimizationResult> {
    try {
      return await this.post<OptimizationResult>(`${this.ZONES_ENDPOINT}/${zoneId}/optimize`, parameters || {})
    } catch (error) {
      console.error(`Failed to optimize schedule for zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  // Démarrer l'irrigation manuellement
  async startIrrigation(zoneId: string, duration: number): Promise<void> {
    try {
      await this.post<void>(`${this.ZONES_ENDPOINT}/${zoneId}/start`, { duration })
    } catch (error) {
      console.error(`Failed to start irrigation for zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  // Arrêter l'irrigation manuellement
  async stopIrrigation(zoneId: string): Promise<void> {
    try {
      await this.post<void>(`${this.ZONES_ENDPOINT}/${zoneId}/stop`, {})
    } catch (error) {
      console.error(`Failed to stop irrigation for zone with ID ${zoneId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const irrigationService = new IrrigationService()
