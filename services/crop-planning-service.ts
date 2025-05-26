import { ApiService } from "./api-service"
import type { RotationPlan, Season, CropPlan, CropRotation } from "../types/crop-planning"

class CropPlanningService extends ApiService {
  private readonly CROP_PLANNING_ENDPOINT = "/crop-planning"

  // Plans de rotation des cultures
  async getAllRotationPlans(): Promise<RotationPlan[]> {
    try {
      return await this.get<RotationPlan[]>(`${this.CROP_PLANNING_ENDPOINT}/rotation-plans`)
    } catch (error) {
      console.error("Failed to fetch rotation plans:", error)
      throw error
    }
  }

  async getRotationPlanById(planId: string): Promise<RotationPlan> {
    try {
      return await this.get<RotationPlan>(`${this.CROP_PLANNING_ENDPOINT}/rotation-plans/${planId}`)
    } catch (error) {
      console.error(`Failed to fetch rotation plan with ID ${planId}:`, error)
      throw error
    }
  }

  async createRotationPlan(planData: Partial<RotationPlan>): Promise<RotationPlan> {
    try {
      return await this.post<RotationPlan>(`${this.CROP_PLANNING_ENDPOINT}/rotation-plans`, planData)
    } catch (error) {
      console.error("Failed to create rotation plan:", error)
      throw error
    }
  }

  async updateRotationPlan(planId: string, planData: Partial<RotationPlan>): Promise<RotationPlan> {
    try {
      return await this.put<RotationPlan>(`${this.CROP_PLANNING_ENDPOINT}/rotation-plans/${planId}`, planData)
    } catch (error) {
      console.error(`Failed to update rotation plan with ID ${planId}:`, error)
      throw error
    }
  }

  async deleteRotationPlan(planId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.CROP_PLANNING_ENDPOINT}/rotation-plans/${planId}`)
    } catch (error) {
      console.error(`Failed to delete rotation plan with ID ${planId}:`, error)
      throw error
    }
  }

  // Saisons
  async getAllSeasons(): Promise<Season[]> {
    try {
      return await this.get<Season[]>(`${this.CROP_PLANNING_ENDPOINT}/seasons`)
    } catch (error) {
      console.error("Failed to fetch seasons:", error)
      throw error
    }
  }

  async getSeasonById(seasonId: string): Promise<Season> {
    try {
      return await this.get<Season>(`${this.CROP_PLANNING_ENDPOINT}/seasons/${seasonId}`)
    } catch (error) {
      console.error(`Failed to fetch season with ID ${seasonId}:`, error)
      throw error
    }
  }

  async createSeason(seasonData: Partial<Season>): Promise<Season> {
    try {
      return await this.post<Season>(`${this.CROP_PLANNING_ENDPOINT}/seasons`, seasonData)
    } catch (error) {
      console.error("Failed to create season:", error)
      throw error
    }
  }

  async updateSeason(seasonId: string, seasonData: Partial<Season>): Promise<Season> {
    try {
      return await this.put<Season>(`${this.CROP_PLANNING_ENDPOINT}/seasons/${seasonId}`, seasonData)
    } catch (error) {
      console.error(`Failed to update season with ID ${seasonId}:`, error)
      throw error
    }
  }

  async deleteSeason(seasonId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.CROP_PLANNING_ENDPOINT}/seasons/${seasonId}`)
    } catch (error) {
      console.error(`Failed to delete season with ID ${seasonId}:`, error)
      throw error
    }
  }

  // Plans de culture
  async getCropPlansByParcel(parcelId: string): Promise<CropPlan[]> {
    try {
      return await this.get<CropPlan[]>(`${this.CROP_PLANNING_ENDPOINT}/crop-plans/parcel/${parcelId}`)
    } catch (error) {
      console.error(`Failed to fetch crop plans for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  async createCropPlan(planData: Partial<CropPlan>): Promise<CropPlan> {
    try {
      return await this.post<CropPlan>(`${this.CROP_PLANNING_ENDPOINT}/crop-plans`, planData)
    } catch (error) {
      console.error("Failed to create crop plan:", error)
      throw error
    }
  }

  // Rotations de cultures
  async getRotationsBySoilType(soilType: string): Promise<CropRotation[]> {
    try {
      return await this.get<CropRotation[]>(`${this.CROP_PLANNING_ENDPOINT}/rotations/soil-type/${soilType}`)
    } catch (error) {
      console.error(`Failed to fetch rotations for soil type ${soilType}:`, error)
      throw error
    }
  }

  async getRecommendedRotations(parcelId: string): Promise<CropRotation[]> {
    try {
      return await this.get<CropRotation[]>(`${this.CROP_PLANNING_ENDPOINT}/rotations/recommended/${parcelId}`)
    } catch (error) {
      console.error(`Failed to fetch recommended rotations for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const cropPlanningService = new CropPlanningService()
