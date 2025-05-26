import { ApiService } from "./api-service"
import type { SoilData, BiodiversityIndicator, EnvironmentalImpact } from "../types/environment"

class EnvironmentService extends ApiService {
  private readonly ENVIRONMENT_ENDPOINT = "/environment"

  // Données du sol
  async getSoilData(parcelId: string): Promise<SoilData> {
    try {
      return await this.get<SoilData>(`${this.ENVIRONMENT_ENDPOINT}/soil`, {
        params: { parcelId },
      })
    } catch (error) {
      console.error(`Failed to fetch soil data for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  // Indicateurs de biodiversité
  async getBiodiversityIndicators(parcelId: string): Promise<BiodiversityIndicator[]> {
    try {
      return await this.get<BiodiversityIndicator[]>(`${this.ENVIRONMENT_ENDPOINT}/biodiversity`, {
        params: { parcelId },
      })
    } catch (error) {
      console.error(`Failed to fetch biodiversity indicators for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  // Historique des données du sol
  async getSoilHistory(parcelId: string, startDate?: Date, endDate?: Date): Promise<SoilData[]> {
    try {
      const params: Record<string, string> = { parcelId }

      if (startDate) {
        params.startDate = startDate.toISOString()
      }

      if (endDate) {
        params.endDate = endDate.toISOString()
      }

      return await this.get<SoilData[]>(`${this.ENVIRONMENT_ENDPOINT}/soil/history`, { params })
    } catch (error) {
      console.error(`Failed to fetch soil history for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  // Ajouter des données du sol
  async addSoilData(soilData: Partial<SoilData>): Promise<SoilData> {
    try {
      return await this.post<SoilData>(`${this.ENVIRONMENT_ENDPOINT}/soil`, soilData)
    } catch (error) {
      console.error("Failed to add soil data:", error)
      throw error
    }
  }

  // Évaluation de l'impact environnemental
  async getEnvironmentalImpact(parcelId: string): Promise<EnvironmentalImpact> {
    try {
      return await this.get<EnvironmentalImpact>(`${this.ENVIRONMENT_ENDPOINT}/impact`, {
        params: { parcelId },
      })
    } catch (error) {
      console.error(`Failed to fetch environmental impact for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  // Recommandations environnementales
  async getEnvironmentalRecommendations(parcelId: string): Promise<any> {
    try {
      return await this.get<any>(`${this.ENVIRONMENT_ENDPOINT}/recommendations`, {
        params: { parcelId },
      })
    } catch (error) {
      console.error(`Failed to fetch environmental recommendations for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const environmentService = new EnvironmentService()
