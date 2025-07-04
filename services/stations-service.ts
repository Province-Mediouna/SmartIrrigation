import { ApiService } from "./api-service";
import type {
  Station,
  StationStatus,
  StationTelemetry,
  FirmwareUpdate,
} from "../types/station";
import { MOCK_STATIONS } from "@/lib/mocks/station-mocks";

class StationsService extends ApiService {
  private readonly STATIONS_ENDPOINT = "/stations";

  // Récupérer toutes les stations avec pagination, filtrage et recherche
  async getAllStations(params?: {
    page?: number;
    size?: number;
    status?: "online" | "offline" | "warning";
    search?: string;
  }): Promise<Station[]> {
    try {
      return await this.get<Station[]>(this.STATIONS_ENDPOINT, { params });
    } catch (error) {
      console.warn("API stations indisponible, utilisation des mockups.");
      return MOCK_STATIONS;
    }
  }

  // Récupérer une station par son ID
  async getStationById(stationId: string): Promise<Station> {
    try {
      return await this.get<Station>(`${this.STATIONS_ENDPOINT}/${stationId}`);
    } catch (error) {
      console.error(`Failed to fetch station with ID ${stationId}:`, error);
      throw error;
    }
  }

  // Créer une nouvelle station
  async createStation(stationData: Partial<Station>): Promise<Station> {
    try {
      return await this.post<Station>(this.STATIONS_ENDPOINT, stationData);
    } catch (error) {
      console.error("Failed to create station:", error);
      throw error;
    }
  }

  // Mettre à jour une station
  async updateStation(
    stationId: string,
    stationData: Partial<Station>
  ): Promise<Station> {
    try {
      return await this.put<Station>(
        `${this.STATIONS_ENDPOINT}/${stationId}`,
        stationData
      );
    } catch (error) {
      console.error(`Failed to update station with ID ${stationId}:`, error);
      throw error;
    }
  }

  // Supprimer une station
  async deleteStation(stationId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.STATIONS_ENDPOINT}/${stationId}`);
    } catch (error) {
      console.error(`Failed to delete station with ID ${stationId}:`, error);
      throw error;
    }
  }

  // Récupérer les données de télémétrie d'une station
  async getStationTelemetry(
    stationId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<StationTelemetry[]> {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      return await this.get<StationTelemetry[]>(
        `${this.STATIONS_ENDPOINT}/${stationId}/telemetry`,
        { params }
      );
    } catch (error) {
      console.error(
        `Failed to fetch telemetry for station with ID ${stationId}:`,
        error
      );
      throw error;
    }
  }

  // Récupérer le statut d'une station
  async getStationStatus(stationId: string): Promise<StationStatus> {
    try {
      return await this.get<StationStatus>(
        `${this.STATIONS_ENDPOINT}/${stationId}/status`
      );
    } catch (error) {
      console.error(
        `Failed to fetch status for station with ID ${stationId}:`,
        error
      );
      throw error;
    }
  }

  // Calibration avec données (corps de requête)
  async calibrateSensors(
    stationId: string,
    calibrationData?: Record<string, any>
  ): Promise<void> {
    try {
      await this.post<void>(
        `${this.STATIONS_ENDPOINT}/${stationId}/calibration`,
        calibrationData || {}
      );
    } catch (error) {
      console.error(
        `Failed to calibrate sensors for station with ID ${stationId}:`,
        error
      );
      throw error;
    }
  }

  // Récupérer la version du firmware d'une station
  async getFirmwareVersion(stationId: string): Promise<string> {
    try {
      // On suppose que l'API retourne un objet { version: string }
      const res = await this.get<{ version: string }>(
        `${this.STATIONS_ENDPOINT}/${stationId}/firmware`
      );
      return res.version;
    } catch (error) {
      console.error(
        `Failed to fetch firmware version for station with ID ${stationId}:`,
        error
      );
      throw error;
    }
  }

  // Mettre à jour le firmware d'une station (corrigé pour endpoint REST standard)
  async updateFirmware(
    stationId: string,
    firmwareData: FirmwareUpdate
  ): Promise<void> {
    try {
      await this.post<void>(
        `${this.STATIONS_ENDPOINT}/${stationId}/firmware`,
        firmwareData
      );
    } catch (error) {
      console.error(
        `Failed to update firmware for station with ID ${stationId}:`,
        error
      );
      throw error;
    }
  }

  // Redémarrer une station
  async restartStation(stationId: string): Promise<void> {
    try {
      await this.post<void>(
        `${this.STATIONS_ENDPOINT}/${stationId}/restart`,
        {}
      );
    } catch (error) {
      console.error(`Failed to restart station with ID ${stationId}:`, error);
      throw error;
    }
  }

  // Récupérer l'historique des mises à jour de firmware
  async getFirmwareUpdateHistory(stationId: string): Promise<FirmwareUpdate[]> {
    try {
      return await this.get<FirmwareUpdate[]>(
        `${this.STATIONS_ENDPOINT}/${stationId}/firmware-history`
      );
    } catch (error) {
      console.error(
        `Failed to fetch firmware history for station with ID ${stationId}:`,
        error
      );
      throw error;
    }
  }
}

// Exporter une instance singleton du service
export const stationsService = new StationsService();
