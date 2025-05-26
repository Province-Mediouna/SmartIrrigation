import { ApiService } from "./api-service"
import type { MLModel, MLModelTraining, DiseasePredictionRequest, DiseasePrediction } from "../types/ml"

class MLService extends ApiService {
  private readonly ML_ENDPOINT = "/ml"

  // Récupérer tous les modèles ML
  async getAllModels(): Promise<MLModel[]> {
    try {
      return await this.get<MLModel[]>(`${this.ML_ENDPOINT}/models`)
    } catch (error) {
      console.error("Failed to fetch ML models:", error)
      throw error
    }
  }

  // Récupérer un modèle ML par son ID
  async getModelById(modelId: string): Promise<MLModel> {
    try {
      return await this.get<MLModel>(`${this.ML_ENDPOINT}/models/${modelId}`)
    } catch (error) {
      console.error(`Failed to fetch ML model with ID ${modelId}:`, error)
      throw error
    }
  }

  // Entraîner un nouveau modèle ML
  async trainModel(trainingData: MLModelTraining): Promise<MLModel> {
    try {
      return await this.post<MLModel>(`${this.ML_ENDPOINT}/models`, trainingData)
    } catch (error) {
      console.error("Failed to train ML model:", error)
      throw error
    }
  }

  // Supprimer un modèle ML
  async deleteModel(modelId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.ML_ENDPOINT}/models/${modelId}`)
    } catch (error) {
      console.error(`Failed to delete ML model with ID ${modelId}:`, error)
      throw error
    }
  }

  // Prédiction de maladies des cultures
  async predictCropDisease(predictionRequest: DiseasePredictionRequest): Promise<DiseasePrediction> {
    try {
      return await this.post<DiseasePrediction>(`${this.ML_ENDPOINT}/predictions/crop-disease`, predictionRequest)
    } catch (error) {
      console.error("Failed to predict crop disease:", error)
      throw error
    }
  }

  // Évaluer un modèle ML
  async evaluateModel(modelId: string, testDataset: string): Promise<any> {
    try {
      return await this.post<any>(`${this.ML_ENDPOINT}/models/${modelId}/evaluate`, { testDataset })
    } catch (error) {
      console.error(`Failed to evaluate ML model with ID ${modelId}:`, error)
      throw error
    }
  }

  // Déployer un modèle ML
  async deployModel(modelId: string): Promise<void> {
    try {
      await this.post<void>(`${this.ML_ENDPOINT}/models/${modelId}/deploy`, {})
    } catch (error) {
      console.error(`Failed to deploy ML model with ID ${modelId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const mlService = new MLService()
