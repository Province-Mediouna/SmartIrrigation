import { ApiService } from "./api-service"
import type {
  WaterSource,
  WaterSourceDetails,
  WaterQualityData,
  WaterLevelData,
  WaterUsageReport,
} from "../types/water-resource"

class WaterResourcesService extends ApiService {
  private readonly RESOURCES_ENDPOINT = "/water-resources"

  // Sources d'eau
  async getAllWaterSources(): Promise<WaterSource[]> {
    try {
      return await this.get<WaterSource[]>(this.RESOURCES_ENDPOINT)
    } catch (error) {
      console.error("Failed to fetch water sources:", error)
      throw error
    }
  }

  async getWaterSourceById(sourceId: string): Promise<WaterSourceDetails> {
    try {
      return await this.get<WaterSourceDetails>(`${this.RESOURCES_ENDPOINT}/${sourceId}`)
    } catch (error) {
      console.error(`Failed to fetch water source with ID ${sourceId}:`, error)
      throw error
    }
  }

  async getWaterSources (options?: { page?: number; pageSize?: number }): Promise<{
    data: WaterSource[]
    total: number
    totalPages: number
  }> {
    try {
      const params: Record<string, string> = {}
      if (options?.page) params.page = options.page.toString()
      if (options?.pageSize) params.pageSize = options.pageSize.toString()

      return await this.get<{ data: WaterSource[], total: number, totalPages: number }>(this.RESOURCES_ENDPOINT, { params })
    } catch (error) {
      console.error("Failed to fetch water sources:", error)
      throw error
    }
  } 

  async createWaterSource(sourceData: Partial<WaterSource>): Promise<WaterSource> {
    try {
      return await this.post<WaterSource>(this.RESOURCES_ENDPOINT, sourceData)
    } catch (error) {
      console.error("Failed to create water source:", error)
      throw error
    }
  }

  async updateWaterSource(sourceId: string, sourceData: Partial<WaterSource>): Promise<WaterSource> {
    try {
      return await this.put<WaterSource>(`${this.RESOURCES_ENDPOINT}/${sourceId}`, sourceData)
    } catch (error) {
      console.error(`Failed to update water source with ID ${sourceId}:`, error)
      throw error
    }
  }

  async deleteWaterSource(sourceId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.RESOURCES_ENDPOINT}/${sourceId}`)
    } catch (error) {
      console.error(`Failed to delete water source with ID ${sourceId}:`, error)
      throw error
    }
  }

  // Qualité de l'eau
  async getWaterQualityData(sourceId: string, startDate?: Date, endDate?: Date): Promise<WaterQualityData[]> {
    try {
      const params: Record<string, string> = {}
      if (startDate) params.startDate = startDate.toISOString()
      if (endDate) params.endDate = endDate.toISOString()

      return await this.get<WaterQualityData[]>(`${this.RESOURCES_ENDPOINT}/${sourceId}/quality`, { params })
    } catch (error) {
      console.error(`Failed to fetch water quality data for source with ID ${sourceId}:`, error)
      throw error
    }
  }

  async addWaterQualityData(sourceId: string, qualityData: Partial<WaterQualityData>): Promise<WaterQualityData> {
    try {
      return await this.post<WaterQualityData>(`${this.RESOURCES_ENDPOINT}/${sourceId}/quality`, qualityData)
    } catch (error) {
      console.error(`Failed to add water quality data for source with ID ${sourceId}:`, error)
      throw error
    }
  }

  // Niveau d'eau
  async getWaterLevelData(sourceId: string, startDate?: Date, endDate?: Date): Promise<WaterLevelData[]> {
    try {
      const params: Record<string, string> = {}
      if (startDate) params.startDate = startDate.toISOString()
      if (endDate) params.endDate = endDate.toISOString()

      return await this.get<WaterLevelData[]>(`${this.RESOURCES_ENDPOINT}/${sourceId}/levels`, { params })
    } catch (error) {
      console.error(`Failed to fetch water level data for source with ID ${sourceId}:`, error)
      throw error
    }
  }

  async addWaterLevelData(sourceId: string, levelData: Partial<WaterLevelData>): Promise<WaterLevelData> {
    try {
      return await this.post<WaterLevelData>(`${this.RESOURCES_ENDPOINT}/${sourceId}/levels`, levelData)
    } catch (error) {
      console.error(`Failed to add water level data for source with ID ${sourceId}:`, error)
      throw error
    }
  }

  // Rapports d'utilisation
  async getWaterUsageReport(sourceId: string, startDate: Date, endDate: Date): Promise<WaterUsageReport> {
    try {
      return await this.get<WaterUsageReport>(`${this.RESOURCES_ENDPOINT}/${sourceId}/usage-report`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      })
    } catch (error) {
      console.error(`Failed to fetch water usage report for source with ID ${sourceId}:`, error)
      throw error
    }
  }

  // Allocation d'eau
  async allocateWaterToZone(sourceId: string, zoneId: string, amount: number): Promise<void> {
    try {
      await this.post<void>(`${this.RESOURCES_ENDPOINT}/${sourceId}/allocate`, { zoneId, amount })
    } catch (error) {
      console.error(`Failed to allocate water from source with ID ${sourceId} to zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  // Prévisions de disponibilité
  async getAvailabilityForecast(sourceId: string, days = 30): Promise<WaterLevelData[]> {
    try {
      return await this.get<WaterLevelData[]>(`${this.RESOURCES_ENDPOINT}/${sourceId}/forecast`, { params: { days } })
    } catch (error) {
      console.error(`Failed to fetch availability forecast for source with ID ${sourceId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const waterResourcesService = new WaterResourcesService()
