import { ApiService } from "./api-service"
import type { AquaponicSystem, FishMonitoring, WaterQualityMonitoring } from "../types/aquaponics"

class AquaponicsService extends ApiService {
  private readonly AQUAPONICS_ENDPOINT = "/aquaponics"

  // Systèmes aquaponiques
  async getAllSystems(): Promise<AquaponicSystem[]> {
    try {
      return await this.get<AquaponicSystem[]>(`${this.AQUAPONICS_ENDPOINT}/systems`)
    } catch (error) {
      console.error("Failed to fetch aquaponic systems:", error)
      throw error
    }
  }

  async getSystemById(systemId: string): Promise<AquaponicSystem> {
    try {
      return await this.get<AquaponicSystem>(`${this.AQUAPONICS_ENDPOINT}/systems/${systemId}`)
    } catch (error) {
      console.error(`Failed to fetch aquaponic system with ID ${systemId}:`, error)
      throw error
    }
  }

  async createSystem(systemData: Partial<AquaponicSystem>): Promise<AquaponicSystem> {
    try {
      return await this.post<AquaponicSystem>(`${this.AQUAPONICS_ENDPOINT}/systems`, systemData)
    } catch (error) {
      console.error("Failed to create aquaponic system:", error)
      throw error
    }
  }

  async updateSystem(systemId: string, systemData: Partial<AquaponicSystem>): Promise<AquaponicSystem> {
    try {
      return await this.put<AquaponicSystem>(`${this.AQUAPONICS_ENDPOINT}/systems/${systemId}`, systemData)
    } catch (error) {
      console.error(`Failed to update aquaponic system with ID ${systemId}:`, error)
      throw error
    }
  }

  async deleteSystem(systemId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.AQUAPONICS_ENDPOINT}/systems/${systemId}`)
    } catch (error) {
      console.error(`Failed to delete aquaponic system with ID ${systemId}:`, error)
      throw error
    }
  }

  // Surveillance des poissons
  async getFishMonitoring(systemId: string): Promise<FishMonitoring> {
    try {
      return await this.get<FishMonitoring>(`${this.AQUAPONICS_ENDPOINT}/fish-monitoring`, {
        params: { systemId },
      })
    } catch (error) {
      console.error(`Failed to fetch fish monitoring for system with ID ${systemId}:`, error)
      throw error
    }
  }

  // Qualité de l'eau
  async getWaterQualityMonitoring(systemId: string): Promise<WaterQualityMonitoring> {
    try {
      return await this.get<WaterQualityMonitoring>(`${this.AQUAPONICS_ENDPOINT}/water-quality/monitoring`, {
        params: { systemId },
      })
    } catch (error) {
      console.error(`Failed to fetch water quality monitoring for system with ID ${systemId}:`, error)
      throw error
    }
  }

  // Ajouter des données de surveillance des poissons
  async addFishMonitoringData(systemId: string, monitoringData: Partial<FishMonitoring>): Promise<FishMonitoring> {
    try {
      return await this.post<FishMonitoring>(
        `${this.AQUAPONICS_ENDPOINT}/systems/${systemId}/fish-monitoring`,
        monitoringData,
      )
    } catch (error) {
      console.error(`Failed to add fish monitoring data for system with ID ${systemId}:`, error)
      throw error
    }
  }

  // Ajouter des données de qualité de l'eau
  async addWaterQualityData(
    systemId: string,
    qualityData: Partial<WaterQualityMonitoring>,
  ): Promise<WaterQualityMonitoring> {
    try {
      return await this.post<WaterQualityMonitoring>(
        `${this.AQUAPONICS_ENDPOINT}/systems/${systemId}/water-quality`,
        qualityData,
      )
    } catch (error) {
      console.error(`Failed to add water quality data for system with ID ${systemId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const aquaponicsService = new AquaponicsService()
