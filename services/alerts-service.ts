import { ApiService } from "./api-service";
import type {
  Alert,
  AlertRule,
  AlertSeverity,
  AlertStatus,
  AlertType,
  AlertStats,
} from "../types/alert";
import { MOCK_ALERTS } from "@/lib/mocks/alert-mocks";

class AlertsService extends ApiService  {
  private readonly ALERTS_ENDPOINT = "/alerts";
  private readonly RULES_ENDPOINT = "/alerts/rules";

  // Alertes
  async getAllAlerts(
    status?: AlertStatus,
    severity?: AlertSeverity,
    type?: AlertType
  ): Promise<Alert[]> {
    try {
      const params: Record<string, any> = {};
      if (status) params.status = status;
      if (severity) params.severity = severity;
      if (type) params.type = type;

      return await this.get<Alert[]>(this.ALERTS_ENDPOINT, { params });
    } catch (error) {
      console.warn("API indisponible, utilisation des mockups pour les alertes.");
      return MOCK_ALERTS;
    }
  }

  async getAlertById(alertId: string): Promise<Alert> {
    try {
      return await this.get<Alert>(`${this.ALERTS_ENDPOINT}/${alertId}`);
    } catch (error) {
      console.error(`Failed to fetch alert with ID ${alertId}:`, error);
      throw error;
    }
  }

  async updateAlertStatus(
    alertId: string,
    status: AlertStatus
  ): Promise<Alert> {
    try {
      return await this.patch<Alert>(`${this.ALERTS_ENDPOINT}/${alertId}`, {
        status,
      });
    } catch (error) {
      console.error(
        `Failed to update status for alert with ID ${alertId}:`,
        error
      );
      throw error;
    }
  }

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    try {
      return await this.post<Alert>(
        `${this.ALERTS_ENDPOINT}/${alertId}/acknowledge`,
        {}
      );
    } catch (error) {
      console.error(`Failed to acknowledge alert with ID ${alertId}:`, error);
      throw error;
    }
  }

  async resolveAlert(alertId: string, resolution?: string): Promise<Alert> {
    try {
      return await this.post<Alert>(
        `${this.ALERTS_ENDPOINT}/${alertId}/resolve`,
        { resolution }
      );
    } catch (error) {
      console.error(`Failed to resolve alert with ID ${alertId}:`, error);
      throw error;
    }
  }

  // Règles d'alerte
  async getAllRules(): Promise<AlertRule[]> {
    try {
      return await this.get<AlertRule[]>(this.RULES_ENDPOINT);
    } catch (error) {
      console.error("Failed to fetch alert rules:", error);
      throw error;
    }
  }

  async getRuleById(ruleId: string): Promise<AlertRule> {
    try {
      return await this.get<AlertRule>(`${this.RULES_ENDPOINT}/${ruleId}`);
    } catch (error) {
      console.error(`Failed to fetch alert rule with ID ${ruleId}:`, error);
      throw error;
    }
  }

  async createRule(ruleData: Partial<AlertRule>): Promise<AlertRule> {
    try {
      return await this.post<AlertRule>(this.RULES_ENDPOINT, ruleData);
    } catch (error) {
      console.error("Failed to create alert rule:", error);
      throw error;
    }
  }

  async updateRule(
    ruleId: string,
    ruleData: Partial<AlertRule>
  ): Promise<AlertRule> {
    try {
      return await this.put<AlertRule>(
        `${this.RULES_ENDPOINT}/${ruleId}`,
        ruleData
      );
    } catch (error) {
      console.error(`Failed to update alert rule with ID ${ruleId}:`, error);
      throw error;
    }
  }

  async deleteRule(ruleId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.RULES_ENDPOINT}/${ruleId}`);
    } catch (error) {
      console.error(`Failed to delete alert rule with ID ${ruleId}:`, error);
      throw error;
    }
  }

  async enableRule(ruleId: string): Promise<AlertRule> {
    try {
      return await this.post<AlertRule>(
        `${this.RULES_ENDPOINT}/${ruleId}/enable`,
        {}
      );
    } catch (error) {
      console.error(`Failed to enable alert rule with ID ${ruleId}:`, error);
      throw error;
    }
  }

  async disableRule(ruleId: string): Promise<AlertRule> {
    try {
      return await this.post<AlertRule>(
        `${this.RULES_ENDPOINT}/${ruleId}/disable`,
        {}
      );
    } catch (error) {
      console.error(`Failed to disable alert rule with ID ${ruleId}:`, error);
      throw error;
    }
  }

  // Statistiques d'alerte
  async getAlertStats(startDate?: Date, endDate?: Date): Promise<AlertStats> {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      return await this.get<AlertStats>(`${this.ALERTS_ENDPOINT}/stats`, {
        params,
      });
    } catch (error) {
      console.error("Failed to fetch alert statistics:", error);
      throw error;
    }
  }

  // Alertes par entité
  async getAlertsByStation(stationId: string): Promise<Alert[]> {
    try {
      return await this.get<Alert[]>(`/stations/${stationId}/alerts`);
    } catch (error) {
      console.error(
        `Failed to fetch alerts for station with ID ${stationId}:`,
        error
      );
      throw error;
    }
  }

  async getAlertsByZone(zoneId: string): Promise<Alert[]> {
    try {
      return await this.get<Alert[]>(`/irrigation/zones/${zoneId}/alerts`);
    } catch (error) {
      console.error(
        `Failed to fetch alerts for zone with ID ${zoneId}:`,
        error
      );
      throw error;
    }
  }

  async getAlertsByParcel(parcelId: string): Promise<Alert[]> {
    try {
      return await this.get<Alert[]>(`/parcels/${parcelId}/alerts`);
    } catch (error) {
      console.error(
        `Failed to fetch alerts for parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }

  async getAlertsByWaterSource(sourceId: string): Promise<Alert[]> {
    try {
      return await this.get<Alert[]>(`/water-resources/${sourceId}/alerts`);
    } catch (error) {
      console.error(
        `Failed to fetch alerts for water source with ID ${sourceId}:`,
        error
      );
      throw error;
    }
  }

  async getAlertsByDrone(droneId: string): Promise<Alert[]> {
    try {
      return await this.get<Alert[]>(`/drones/${droneId}/alerts`);
    } catch (error) {
      console.error(
        `Failed to fetch alerts for drone with ID ${droneId}:`,
        error
      );
      throw error;
    }
  }
}

// Exporter une instance singleton du service
export const alertsService = new AlertsService();
