import { ApiService } from "./api-service"
import type {
  Drone,
  DroneDetails,
  DroneMission,
  DroneStatus,
  DroneImage,
  DroneMaintenanceRecord,
  MissionPlan,
  DroneImageAnalysis,
  FlightPlan,
  DroneCommand,
} from "../types/drone"

class DronesService extends ApiService {
  private readonly DRONES_ENDPOINT = "/drones"
  private readonly MISSIONS_ENDPOINT = "/drone-missions"
  private readonly IMAGES_ENDPOINT = "/drone-images"
  private readonly ANALYSIS_ENDPOINT = "/drones/analysis"

  // Drones
  async getAllDrones(): Promise<Drone[]> {
    try {
      return await this.get<Drone[]>(this.DRONES_ENDPOINT)
    } catch (error) {
      console.error("Failed to fetch drones:", error)
      throw error
    }
  }

  async getDroneById(droneId: string): Promise<DroneDetails> {
    try {
      return await this.get<DroneDetails>(`${this.DRONES_ENDPOINT}/${droneId}`)
    } catch (error) {
      console.error(`Failed to fetch drone with ID ${droneId}:`, error)
      throw error
    }
  }

  async createDrone(droneData: Partial<Drone>): Promise<Drone> {
    try {
      return await this.post<Drone>(this.DRONES_ENDPOINT, droneData)
    } catch (error) {
      console.error("Failed to create drone:", error)
      throw error
    }
  }

  async updateDrone(droneId: string, droneData: Partial<Drone>): Promise<Drone> {
    try {
      return await this.put<Drone>(`${this.DRONES_ENDPOINT}/${droneId}`, droneData)
    } catch (error) {
      console.error(`Failed to update drone with ID ${droneId}:`, error)
      throw error
    }
  }

  async deleteDrone(droneId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.DRONES_ENDPOINT}/${droneId}`)
    } catch (error) {
      console.error(`Failed to delete drone with ID ${droneId}:`, error)
      throw error
    }
  }

  // Statut du drone
  async getDroneStatus(droneId: string): Promise<DroneStatus> {
    try {
      return await this.get<DroneStatus>(`${this.DRONES_ENDPOINT}/${droneId}/status`)
    } catch (error) {
      console.error(`Failed to fetch status for drone with ID ${droneId}:`, error)
      throw error
    }
  }

  // Missions de drone
  async getMissionsByDrone(droneId: string): Promise<DroneMission[]> {
    try {
      return await this.get<DroneMission[]>(`${this.DRONES_ENDPOINT}/${droneId}/missions`)
    } catch (error) {
      console.error(`Failed to fetch missions for drone with ID ${droneId}:`, error)
      throw error
    }
  }

  async getMissionById(missionId: string): Promise<DroneMission> {
    try {
      return await this.get<DroneMission>(`${this.MISSIONS_ENDPOINT}/${missionId}`)
    } catch (error) {
      console.error(`Failed to fetch mission with ID ${missionId}:`, error)
      throw error
    }
  }

  async createMission(missionData: Partial<DroneMission>): Promise<DroneMission> {
    try {
      return await this.post<DroneMission>(this.MISSIONS_ENDPOINT, missionData)
    } catch (error) {
      console.error("Failed to create mission:", error)
      throw error
    }
  }

  async updateMission(missionId: string, missionData: Partial<DroneMission>): Promise<DroneMission> {
    try {
      return await this.put<DroneMission>(`${this.MISSIONS_ENDPOINT}/${missionId}`, missionData)
    } catch (error) {
      console.error(`Failed to update mission with ID ${missionId}:`, error)
      throw error
    }
  }

  async deleteMission(missionId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.MISSIONS_ENDPOINT}/${missionId}`)
    } catch (error) {
      console.error(`Failed to delete mission with ID ${missionId}:`, error)
      throw error
    }
  }

  // Images de drone
  async getImagesByMission(missionId: string): Promise<DroneImage[]> {
    try {
      return await this.get<DroneImage[]>(`${this.MISSIONS_ENDPOINT}/${missionId}/images`)
    } catch (error) {
      console.error(`Failed to fetch images for mission with ID ${missionId}:`, error)
      throw error
    }
  }

  async getImageById(imageId: string): Promise<DroneImage> {
    try {
      return await this.get<DroneImage>(`${this.IMAGES_ENDPOINT}/${imageId}`)
    } catch (error) {
      console.error(`Failed to fetch image with ID ${imageId}:`, error)
      throw error
    }
  }

  async uploadImage(missionId: string, imageData: FormData): Promise<DroneImage> {
    try {
      return await this.post<DroneImage>(`${this.MISSIONS_ENDPOINT}/${missionId}/images`, imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      console.error(`Failed to upload image for mission with ID ${missionId}:`, error)
      throw error
    }
  }

  async deleteImage(imageId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.IMAGES_ENDPOINT}/${imageId}`)
    } catch (error) {
      console.error(`Failed to delete image with ID ${imageId}:`, error)
      throw error
    }
  }

  // Maintenance des drones
  async getMaintenanceRecords(droneId: string): Promise<DroneMaintenanceRecord[]> {
    try {
      return await this.get<DroneMaintenanceRecord[]>(`${this.DRONES_ENDPOINT}/${droneId}/maintenance`)
    } catch (error) {
      console.error(`Failed to fetch maintenance records for drone with ID ${droneId}:`, error)
      throw error
    }
  }

  async addMaintenanceRecord(
    droneId: string,
    recordData: Partial<DroneMaintenanceRecord>,
  ): Promise<DroneMaintenanceRecord> {
    try {
      return await this.post<DroneMaintenanceRecord>(`${this.DRONES_ENDPOINT}/${droneId}/maintenance`, recordData)
    } catch (error) {
      console.error(`Failed to add maintenance record for drone with ID ${droneId}:`, error)
      throw error
    }
  }

  // Planification de mission
  async createMissionPlan(droneId: string, planData: Partial<MissionPlan>): Promise<MissionPlan> {
    try {
      return await this.post<MissionPlan>(`${this.DRONES_ENDPOINT}/${droneId}/mission-plans`, planData)
    } catch (error) {
      console.error(`Failed to create mission plan for drone with ID ${droneId}:`, error)
      throw error
    }
  }

  async executeMissionPlan(planId: string): Promise<DroneMission> {
    try {
      return await this.post<DroneMission>(`/mission-plans/${planId}/execute`, {})
    } catch (error) {
      console.error(`Failed to execute mission plan with ID ${planId}:`, error)
      throw error
    }
  }

  // Contrôle du drone
  async launchDrone(droneId: string): Promise<void> {
    try {
      await this.post<void>(`${this.DRONES_ENDPOINT}/${droneId}/launch`, {})
    } catch (error) {
      console.error(`Failed to launch drone with ID ${droneId}:`, error)
      throw error
    }
  }

  async landDrone(droneId: string): Promise<void> {
    try {
      await this.post<void>(`${this.DRONES_ENDPOINT}/${droneId}/land`, {})
    } catch (error) {
      console.error(`Failed to land drone with ID ${droneId}:`, error)
      throw error
    }
  }

  async sendCommand(droneId: string, command: DroneCommand): Promise<void> {
    try {
      await this.post<void>(`${this.DRONES_ENDPOINT}/${droneId}/command`, command)
    } catch (error) {
      console.error(`Failed to send command to drone with ID ${droneId}:`, error)
      throw error
    }
  }

  // Analyse d'images
  async analyzeImages(analysisRequest: DroneImageAnalysis): Promise<any> {
    try {
      return await this.post<any>(this.ANALYSIS_ENDPOINT, analysisRequest)
    } catch (error) {
      console.error("Failed to analyze drone images:", error)
      throw error
    }
  }

  // Planification de vol
  async createFlightPlan(droneId: string, flightPlan: FlightPlan): Promise<FlightPlan> {
    try {
      return await this.post<FlightPlan>(`${this.DRONES_ENDPOINT}/${droneId}/flight-plans`, flightPlan)
    } catch (error) {
      console.error(`Failed to create flight plan for drone with ID ${droneId}:`, error)
      throw error
    }
  }

  async getFlightPlans(droneId: string): Promise<FlightPlan[]> {
    try {
      return await this.get<FlightPlan[]>(`${this.DRONES_ENDPOINT}/${droneId}/flight-plans`)
    } catch (error) {
      console.error(`Failed to fetch flight plans for drone with ID ${droneId}:`, error)
      throw error
    }
  }

  // Statistiques d'utilisation
  async getDroneUsageStats(droneId: string, startDate?: Date, endDate?: Date): Promise<any> {
    try {
      const params: Record<string, string> = {}
      if (startDate) params.startDate = startDate.toISOString()
      if (endDate) params.endDate = endDate.toISOString()

      return await this.get<any>(`${this.DRONES_ENDPOINT}/${droneId}/stats`, { params })
    } catch (error) {
      console.error(`Failed to fetch usage stats for drone with ID ${droneId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const dronesService = new DronesService()
