import { ApiService } from "./api-service"
import type { ClimateControl, VentilationControl, CO2Management } from "../types/greenhouse"

class GreenhousesService extends ApiService {
  private readonly GREENHOUSES_ENDPOINT = "/greenhouses"

  // Contrôle climatique
  async setClimateControl(controlData: Partial<ClimateControl>): Promise<ClimateControl> {
    try {
      return await this.post<ClimateControl>(`${this.GREENHOUSES_ENDPOINT}/climate-control`, controlData)
    } catch (error) {
      console.error("Failed to set climate control:", error)
      throw error
    }
  }

  async getClimateControl(greenhouseId: string): Promise<ClimateControl> {
    try {
      return await this.get<ClimateControl>(`${this.GREENHOUSES_ENDPOINT}/${greenhouseId}/climate-control`)
    } catch (error) {
      console.error(`Failed to fetch climate control for greenhouse with ID ${greenhouseId}:`, error)
      throw error
    }
  }

  // Gestion de la ventilation
  async setVentilationControl(controlData: Partial<VentilationControl>): Promise<VentilationControl> {
    try {
      return await this.post<VentilationControl>(`${this.GREENHOUSES_ENDPOINT}/ventilation`, controlData)
    } catch (error) {
      console.error("Failed to set ventilation control:", error)
      throw error
    }
  }

  async getVentilationControl(greenhouseId: string): Promise<VentilationControl> {
    try {
      return await this.get<VentilationControl>(`${this.GREENHOUSES_ENDPOINT}/${greenhouseId}/ventilation`)
    } catch (error) {
      console.error(`Failed to fetch ventilation control for greenhouse with ID ${greenhouseId}:`, error)
      throw error
    }
  }

  // Gestion du CO2
  async setCO2Management(managementData: Partial<CO2Management>): Promise<CO2Management> {
    try {
      return await this.post<CO2Management>(`${this.GREENHOUSES_ENDPOINT}/co2-management`, managementData)
    } catch (error) {
      console.error("Failed to set CO2 management:", error)
      throw error
    }
  }

  async getCO2Management(greenhouseId: string): Promise<CO2Management> {
    try {
      return await this.get<CO2Management>(`${this.GREENHOUSES_ENDPOINT}/${greenhouseId}/co2-management`)
    } catch (error) {
      console.error(`Failed to fetch CO2 management for greenhouse with ID ${greenhouseId}:`, error)
      throw error
    }
  }

  // Récupérer les données environnementales d'une serre
  async getEnvironmentalData(greenhouseId: string): Promise<any> {
    try {
      return await this.get<any>(`${this.GREENHOUSES_ENDPOINT}/${greenhouseId}/environmental-data`)
    } catch (error) {
      console.error(`Failed to fetch environmental data for greenhouse with ID ${greenhouseId}:`, error)
      throw error
    }
  }

  // Contrôle de l'irrigation dans une serre
  async setIrrigationControl(greenhouseId: string, controlData: any): Promise<any> {
    try {
      return await this.post<any>(`${this.GREENHOUSES_ENDPOINT}/${greenhouseId}/irrigation-control`, controlData)
    } catch (error) {
      console.error(`Failed to set irrigation control for greenhouse with ID ${greenhouseId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const greenhousesService = new GreenhousesService()
