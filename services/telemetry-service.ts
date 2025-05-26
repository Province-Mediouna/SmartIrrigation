import { ApiService } from "./api-service";
import type {
  TelemetryHealth,
  StationHealth,
  TelemetryMetric,
  TelemetryFilter,
} from "../types/telemetry";

class TelemetryService extends ApiService {
  private readonly TELEMETRY_ENDPOINT = "/telemetry";

  // Récupérer l'état de santé d'une station ou du système global
  async getStationHealth(stationId: string): Promise<TelemetryHealth> {
    try {
      // Pour une station spécifique
      if (stationId !== "global") {
        const health = await this.get<StationHealth>(
          `${this.TELEMETRY_ENDPOINT}/stations/${stationId}/health`
        );
        // Convertir StationHealth en TelemetryHealth pour l'interface utilisateur
        return {
          systemStatus: health.sensorStatus.overall || "unknown",
          batteryAvg: health.batteryLevel,
          signalStrength: health.signalStrength,
          activeStations: health.sensorStatus.activeCount || 1,
          totalStations: health.sensorStatus.totalCount || 1,
          lastUpdate: health.lastSync,
        };
      }

      // Pour le système global
      return await this.get<TelemetryHealth>(
        `${this.TELEMETRY_ENDPOINT}/health`
      );
    } catch (error) {
      console.error(
        `Failed to get health for ${
          stationId === "global" ? "system" : "station " + stationId
        }:`,
        error
      );
      throw error;
    }
  }

  // Récupérer les métriques de télémétrie d'une station avec pagination et filtres de date
  async getStationMetrics(
    stationId: string,
    filters: TelemetryFilter
  ): Promise<{
    data: TelemetryMetric[];
    total: number;
    page: number;
    size: number;
  }> {
    try {
      const { startDate, endDate, page = 1, size = 10 } = filters;
      const queryParams = new URLSearchParams();

      if (startDate) queryParams.append("startDate", startDate.toISOString());
      if (endDate) queryParams.append("endDate", endDate.toISOString());
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      return await this.get<{
        data: TelemetryMetric[];
        total: number;
        page: number;
        size: number;
      }>(
        `${
          this.TELEMETRY_ENDPOINT
        }/stations/${stationId}/metrics?${queryParams.toString()}`
      );
    } catch (error) {
      console.error(`Failed to get metrics for station ${stationId}:`, error);
      throw error;
    }
  }

  // Récupérer les données en temps réel d'une station
  async getRealTimeData(stationId: string): Promise<TelemetryMetric[]> {
    try {
      return await this.get<TelemetryMetric[]>(
        `${this.TELEMETRY_ENDPOINT}/stations/${stationId}/realtime`
      );
    } catch (error) {
      console.error(
        `Failed to get real-time data for station ${stationId}:`,
        error
      );
      throw error;
    }
  }

  // Configurer les seuils d'alerte pour une métrique spécifique
  async configureAlertThresholds(
    stationId: string,
    metricType: string,
    minThreshold: number,
    maxThreshold: number
  ): Promise<void> {
    try {
      await this.post<void>(
        `${this.TELEMETRY_ENDPOINT}/stations/${stationId}/thresholds`,
        {
          metricType,
          minThreshold,
          maxThreshold,
        }
      );
    } catch (error) {
      console.error(
        `Failed to configure thresholds for station ${stationId}:`,
        error
      );
      throw error;
    }
  }
}

// Exporter une instance singleton du service
export const telemetryService = new TelemetryService();
