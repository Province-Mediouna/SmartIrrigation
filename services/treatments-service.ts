import { ApiService } from "./api-service"
import type { Treatment, CompatibilityCheck, CompatibilityResult, TreatmentApplication } from "../types/treatment"

class TreatmentsService extends ApiService {
  private readonly TREATMENTS_ENDPOINT = "/treatments"

  // Récupérer tous les traitements
  async getAllTreatments(page = 0, size = 20, type?: string): Promise<{ treatments: Treatment[]; totalCount: number }> {
    try {
      const params: Record<string, string> = { page: page.toString(), size: size.toString() }

      if (type) {
        params.type = type
      }

      return await this.get<{ treatments: Treatment[]; totalCount: number }>(this.TREATMENTS_ENDPOINT, { params })
    } catch (error) {
      console.error("Failed to fetch treatments:", error)
      throw error
    }
  }

  // Récupérer un traitement par son ID
  async getTreatmentById(treatmentId: string): Promise<Treatment> {
    try {
      return await this.get<Treatment>(`${this.TREATMENTS_ENDPOINT}/${treatmentId}`)
    } catch (error) {
      console.error(`Failed to fetch treatment with ID ${treatmentId}:`, error)
      throw error
    }
  }

  // Créer un nouveau traitement
  async createTreatment(treatmentData: Partial<Treatment>): Promise<Treatment> {
    try {
      return await this.post<Treatment>(this.TREATMENTS_ENDPOINT, treatmentData)
    } catch (error) {
      console.error("Failed to create treatment:", error)
      throw error
    }
  }

  // Mettre à jour un traitement
  async updateTreatment(treatmentId: string, treatmentData: Partial<Treatment>): Promise<Treatment> {
    try {
      return await this.put<Treatment>(`${this.TREATMENTS_ENDPOINT}/${treatmentId}`, treatmentData)
    } catch (error) {
      console.error(`Failed to update treatment with ID ${treatmentId}:`, error)
      throw error
    }
  }

  // Supprimer un traitement
  async deleteTreatment(treatmentId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.TREATMENTS_ENDPOINT}/${treatmentId}`)
    } catch (error) {
      console.error(`Failed to delete treatment with ID ${treatmentId}:`, error)
      throw error
    }
  }

  // Vérifier la compatibilité des produits
  async checkCompatibility(compatibilityCheck: CompatibilityCheck): Promise<CompatibilityResult> {
    try {
      return await this.post<CompatibilityResult>(`${this.TREATMENTS_ENDPOINT}/compatibility`, compatibilityCheck)
    } catch (error) {
      console.error("Failed to check treatment compatibility:", error)
      throw error
    }
  }

  // Enregistrer une application de traitement
  async recordApplication(application: TreatmentApplication): Promise<void> {
    try {
      await this.post<void>(`${this.TREATMENTS_ENDPOINT}/applications`, application)
    } catch (error) {
      console.error("Failed to record treatment application:", error)
      throw error
    }
  }

  // Récupérer l'historique des applications pour une parcelle
  async getApplicationHistory(parcelId: string): Promise<TreatmentApplication[]> {
    try {
      return await this.get<TreatmentApplication[]>(`${this.TREATMENTS_ENDPOINT}/applications/history/${parcelId}`)
    } catch (error) {
      console.error(`Failed to fetch application history for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const treatmentsService = new TreatmentsService()
