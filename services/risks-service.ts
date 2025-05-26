import { ApiService } from "./api-service"
import type { RiskAssessment, RiskMitigation, RiskFactor, HistoricalRisk } from "../types/risk"

class RisksService extends ApiService {
  private readonly RISKS_ENDPOINT = "/risks"

  // Évaluation des risques
  async assessRisks(assessment: Partial<RiskAssessment>): Promise<RiskAssessment> {
    try {
      return await this.post<RiskAssessment>(`${this.RISKS_ENDPOINT}/assessment`, assessment)
    } catch (error) {
      console.error("Failed to assess risks:", error)
      throw error
    }
  }

  // Plan d'atténuation des risques
  async mitigateRisks(mitigation: Partial<RiskMitigation>): Promise<RiskMitigation> {
    try {
      return await this.post<RiskMitigation>(`${this.RISKS_ENDPOINT}/mitigation`, mitigation)
    } catch (error) {
      console.error("Failed to create risk mitigation plan:", error)
      throw error
    }
  }

  // Récupérer les facteurs de risque
  async getRiskFactors(parcelId: string): Promise<RiskFactor[]> {
    try {
      return await this.get<RiskFactor[]>(`${this.RISKS_ENDPOINT}/factors`, {
        params: { parcelId },
      })
    } catch (error) {
      console.error(`Failed to fetch risk factors for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  // Récupérer l'historique des risques
  async getRiskHistory(parcelId: string): Promise<HistoricalRisk[]> {
    try {
      return await this.get<HistoricalRisk[]>(`${this.RISKS_ENDPOINT}/history`, {
        params: { parcelId },
      })
    } catch (error) {
      console.error(`Failed to fetch risk history for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  // Alertes de risque
  async getRiskAlerts(): Promise<any> {
    try {
      return await this.get<any>(`${this.RISKS_ENDPOINT}/alerts`)
    } catch (error) {
      console.error("Failed to fetch risk alerts:", error)
      throw error
    }
  }

  // Prévisions de risque
  async getRiskForecast(parcelId: string, days = 30): Promise<any> {
    try {
      return await this.get<any>(`${this.RISKS_ENDPOINT}/forecast`, {
        params: { parcelId, days: days.toString() },
      })
    } catch (error) {
      console.error(`Failed to fetch risk forecast for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const risksService = new RisksService()
