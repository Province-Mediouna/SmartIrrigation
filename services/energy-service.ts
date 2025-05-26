import { ApiService } from "./api-service"
import type { EnergyConsumption, EnergyOptimization, SolarIntegration } from "../types/energy"

class EnergyService extends ApiService {
  private readonly ENERGY_ENDPOINT = "/energy"

  // Consommation énergétique
  async getEnergyConsumption(systemType?: string): Promise<EnergyConsumption[]> {
    try {
      const params: Record<string, string> = {}

      if (systemType) {
        params.systemType = systemType
      }

      return await this.get<EnergyConsumption[]>(`${this.ENERGY_ENDPOINT}/consumption`, { params })
    } catch (error) {
      console.error("Failed to fetch energy consumption:", error)
      throw error
    }
  }

  // Optimisation énergétique
  async createOptimizationPlan(optimizationData: Partial<EnergyOptimization>): Promise<EnergyOptimization> {
    try {
      return await this.post<EnergyOptimization>(`${this.ENERGY_ENDPOINT}/optimization`, optimizationData)
    } catch (error) {
      console.error("Failed to create energy optimization plan:", error)
      throw error
    }
  }

  async getOptimizationPlanById(planId: string): Promise<EnergyOptimization> {
    try {
      return await this.get<EnergyOptimization>(`${this.ENERGY_ENDPOINT}/optimization/${planId}`)
    } catch (error) {
      console.error(`Failed to fetch energy optimization plan with ID ${planId}:`, error)
      throw error
    }
  }

  async updateOptimizationPlan(
    planId: string,
    optimizationData: Partial<EnergyOptimization>,
  ): Promise<EnergyOptimization> {
    try {
      return await this.put<EnergyOptimization>(`${this.ENERGY_ENDPOINT}/optimization/${planId}`, optimizationData)
    } catch (error) {
      console.error(`Failed to update energy optimization plan with ID ${planId}:`, error)
      throw error
    }
  }

  // Intégration énergie solaire
  async createSolarIntegration(integrationData: Partial<SolarIntegration>): Promise<SolarIntegration> {
    try {
      return await this.post<SolarIntegration>(`${this.ENERGY_ENDPOINT}/solar-integration`, integrationData)
    } catch (error) {
      console.error("Failed to create solar integration:", error)
      throw error
    }
  }

  async getSolarIntegrationById(integrationId: string): Promise<SolarIntegration> {
    try {
      return await this.get<SolarIntegration>(`${this.ENERGY_ENDPOINT}/solar-integration/${integrationId}`)
    } catch (error) {
      console.error(`Failed to fetch solar integration with ID ${integrationId}:`, error)
      throw error
    }
  }

  async updateSolarIntegration(
    integrationId: string,
    integrationData: Partial<SolarIntegration>,
  ): Promise<SolarIntegration> {
    try {
      return await this.put<SolarIntegration>(
        `${this.ENERGY_ENDPOINT}/solar-integration/${integrationId}`,
        integrationData,
      )
    } catch (error) {
      console.error(`Failed to update solar integration with ID ${integrationId}:`, error)
      throw error
    }
  }

  // Rapports énergétiques
  async getEnergyReport(systemId: string, startDate: Date, endDate: Date): Promise<any> {
    try {
      return await this.get<any>(`${this.ENERGY_ENDPOINT}/report`, {
        params: {
          systemId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      })
    } catch (error) {
      console.error(`Failed to fetch energy report for system with ID ${systemId}:`, error)
      throw error
    }
  }

  // Prévisions de consommation
  async getConsumptionForecast(systemId: string, days = 30): Promise<any> {
    try {
      return await this.get<any>(`${this.ENERGY_ENDPOINT}/forecast`, {
        params: { systemId, days: days.toString() },
      })
    } catch (error) {
      console.error(`Failed to fetch consumption forecast for system with ID ${systemId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const energyService = new EnergyService()
