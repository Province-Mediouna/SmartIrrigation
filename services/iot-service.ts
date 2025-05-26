import { ApiService } from "./api-service"
import type { IoTDevice, DeviceCommand, DeviceStatus, DeviceConfiguration } from "../types/iot"

class IoTService extends ApiService {
  private readonly IOT_ENDPOINT = "/iot"

  // Récupérer tous les dispositifs IoT
  async getAllDevices(): Promise<IoTDevice[]> {
    try {
      return await this.get<IoTDevice[]>(`${this.IOT_ENDPOINT}/devices`)
    } catch (error) {
      console.error("Failed to fetch IoT devices:", error)
      throw error
    }
  }

  // Récupérer un dispositif IoT par son ID
  async getDeviceById(deviceId: string): Promise<IoTDevice> {
    try {
      return await this.get<IoTDevice>(`${this.IOT_ENDPOINT}/devices/${deviceId}`)
    } catch (error) {
      console.error(`Failed to fetch IoT device with ID ${deviceId}:`, error)
      throw error
    }
  }

  // Créer un nouveau dispositif IoT
  async createDevice(deviceData: Partial<IoTDevice>): Promise<IoTDevice> {
    try {
      return await this.post<IoTDevice>(`${this.IOT_ENDPOINT}/devices`, deviceData)
    } catch (error) {
      console.error("Failed to create IoT device:", error)
      throw error
    }
  }

  // Mettre à jour un dispositif IoT
  async updateDevice(deviceId: string, deviceData: Partial<IoTDevice>): Promise<IoTDevice> {
    try {
      return await this.put<IoTDevice>(`${this.IOT_ENDPOINT}/devices/${deviceId}`, deviceData)
    } catch (error) {
      console.error(`Failed to update IoT device with ID ${deviceId}:`, error)
      throw error
    }
  }

  // Supprimer un dispositif IoT
  async deleteDevice(deviceId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.IOT_ENDPOINT}/devices/${deviceId}`)
    } catch (error) {
      console.error(`Failed to delete IoT device with ID ${deviceId}:`, error)
      throw error
    }
  }

  // Envoyer une commande à un dispositif IoT
  async sendCommand(deviceId: string, command: DeviceCommand): Promise<void> {
    try {
      await this.post<void>(`${this.IOT_ENDPOINT}/devices/${deviceId}/command`, command)
    } catch (error) {
      console.error(`Failed to send command to IoT device with ID ${deviceId}:`, error)
      throw error
    }
  }

  // Récupérer le statut d'un dispositif IoT
  async getDeviceStatus(deviceId: string): Promise<DeviceStatus> {
    try {
      return await this.get<DeviceStatus>(`${this.IOT_ENDPOINT}/devices/${deviceId}/status`)
    } catch (error) {
      console.error(`Failed to fetch status for IoT device with ID ${deviceId}:`, error)
      throw error
    }
  }

  // Configurer un dispositif IoT
  async configureDevice(deviceId: string, configuration: DeviceConfiguration): Promise<void> {
    try {
      await this.post<void>(`${this.IOT_ENDPOINT}/devices/${deviceId}/configure`, configuration)
    } catch (error) {
      console.error(`Failed to configure IoT device with ID ${deviceId}:`, error)
      throw error
    }
  }

  // Redémarrer un dispositif IoT
  async restartDevice(deviceId: string): Promise<void> {
    try {
      await this.post<void>(`${this.IOT_ENDPOINT}/devices/${deviceId}/restart`, {})
    } catch (error) {
      console.error(`Failed to restart IoT device with ID ${deviceId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const iotService = new IoTService()
