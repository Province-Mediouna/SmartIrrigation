import { ApiService } from "./api-service"
import type { VerticalSystem, CultureLayer, LightingSchedule } from "../types/vertical-farming"

class VerticalFarmingService extends ApiService {
  private readonly VERTICAL_FARMING_ENDPOINT = "/vertical-farming"

  // Systèmes d'agriculture verticale
  async getAllSystems(): Promise<VerticalSystem[]> {
    try {
      return await this.get<VerticalSystem[]>(`${this.VERTICAL_FARMING_ENDPOINT}/systems`)
    } catch (error) {
      console.error("Failed to fetch vertical farming systems:", error)
      throw error
    }
  }

  async getSystemById(systemId: string): Promise<VerticalSystem> {
    try {
      return await this.get<VerticalSystem>(`${this.VERTICAL_FARMING_ENDPOINT}/systems/${systemId}`)
    } catch (error) {
      console.error(`Failed to fetch vertical farming system with ID ${systemId}:`, error)
      throw error
    }
  }

  async createSystem(systemData: Partial<VerticalSystem>): Promise<VerticalSystem> {
    try {
      return await this.post<VerticalSystem>(`${this.VERTICAL_FARMING_ENDPOINT}/systems`, systemData)
    } catch (error) {
      console.error("Failed to create vertical farming system:", error)
      throw error
    }
  }

  async updateSystem(systemId: string, systemData: Partial<VerticalSystem>): Promise<VerticalSystem> {
    try {
      return await this.put<VerticalSystem>(`${this.VERTICAL_FARMING_ENDPOINT}/systems/${systemId}`, systemData)
    } catch (error) {
      console.error(`Failed to update vertical farming system with ID ${systemId}:`, error)
      throw error
    }
  }

  async deleteSystem(systemId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.VERTICAL_FARMING_ENDPOINT}/systems/${systemId}`)
    } catch (error) {
      console.error(`Failed to delete vertical farming system with ID ${systemId}:`, error)
      throw error
    }
  }

  // Couches de culture
  async getLayersBySystem(systemId: string): Promise<CultureLayer[]> {
    try {
      return await this.get<CultureLayer[]>(`${this.VERTICAL_FARMING_ENDPOINT}/layers/${systemId}`)
    } catch (error) {
      console.error(`Failed to fetch culture layers for system with ID ${systemId}:`, error)
      throw error
    }
  }

  async createLayer(systemId: string, layerData: Partial<CultureLayer>): Promise<CultureLayer> {
    try {
      return await this.post<CultureLayer>(`${this.VERTICAL_FARMING_ENDPOINT}/layers/${systemId}`, layerData)
    } catch (error) {
      console.error(`Failed to create culture layer for system with ID ${systemId}:`, error)
      throw error
    }
  }

  async updateLayer(systemId: string, layerId: string, layerData: Partial<CultureLayer>): Promise<CultureLayer> {
    try {
      return await this.put<CultureLayer>(`${this.VERTICAL_FARMING_ENDPOINT}/layers/${systemId}/${layerId}`, layerData)
    } catch (error) {
      console.error(`Failed to update culture layer with ID ${layerId}:`, error)
      throw error
    }
  }

  async deleteLayer(systemId: string, layerId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.VERTICAL_FARMING_ENDPOINT}/layers/${systemId}/${layerId}`)
    } catch (error) {
      console.error(`Failed to delete culture layer with ID ${layerId}:`, error)
      throw error
    }
  }

  // Programme d'éclairage
  async getLightingSchedule(systemId: string): Promise<LightingSchedule> {
    try {
      return await this.get<LightingSchedule>(`${this.VERTICAL_FARMING_ENDPOINT}/lighting/${systemId}/schedule`)
    } catch (error) {
      console.error(`Failed to fetch lighting schedule for system with ID ${systemId}:`, error)
      throw error
    }
  }

  async updateLightingSchedule(systemId: string, scheduleData: Partial<LightingSchedule>): Promise<LightingSchedule> {
    try {
      return await this.put<LightingSchedule>(
        `${this.VERTICAL_FARMING_ENDPOINT}/lighting/${systemId}/schedule`,
        scheduleData,
      )
    } catch (error) {
      console.error(`Failed to update lighting schedule for system with ID ${systemId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const verticalFarmingService = new VerticalFarmingService()
