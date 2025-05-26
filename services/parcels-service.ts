import { ApiService } from "./api-service";
import type {
  Parcel,
  ParcelDetails,
  CropHistory,
  SoilData,
} from "../types/parcel";
import type { Crop } from "../types/crop";
import type { Soil } from "../types/soil";

export interface ParcelFilters {
  page?: number;
  size?: number;
  soilType?: string;
  status?: "active" | "inactive";
  search?: string;
  hasCrops?: boolean;
  irrigationZones?: number;
  cropCount?: number;
  efficiency?: {
    min?: number;
    max?: number;
  };
  waterUsage?: {
    min?: number;
    max?: number;
  };
  area?: {
    min?: number;
    max?: number;
  };
}

class ParcelsService extends ApiService {
  private readonly PARCELS_ENDPOINT = "/parcels";
  private readonly CROPS_ENDPOINT = "/crops";

  // Parcelles avec pagination et filtres
  private buildParcelFiltersQuery(filters: ParcelFilters): URLSearchParams {
    const queryParams = new URLSearchParams();

    // Pagination parameters
    queryParams.append("page", (filters.page ?? 1).toString());
    queryParams.append("size", (filters.size ?? 10).toString());

    // Simple filters
    const simpleFilters: Record<string, string | undefined> = {
      soilType: filters.soilType,
      status: filters.status,
      search: filters.search,
      hasCrops: filters.hasCrops?.toString(),
      irrigationZones: filters.irrigationZones?.toString(),
      cropCount: filters.cropCount?.toString(),
    };

    Object.entries(simpleFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });

    // Range filters
    this.appendRangeParams(queryParams, "efficiency", filters.efficiency);
    this.appendRangeParams(queryParams, "waterUsage", filters.waterUsage);
    this.appendRangeParams(queryParams, "area", filters.area);

    return queryParams;
  }

  private appendRangeParams(
    params: URLSearchParams,
    prefix: string,
    range?: { min?: number; max?: number }
  ): void {
    if (range?.min !== undefined) {
      params.append(`${prefix}Min`, range.min.toString());
    }
    if (range?.max !== undefined) {
      params.append(`${prefix}Max`, range.max.toString());
    }
  }

  async getParcels(
    filters: ParcelFilters = {}
  ): Promise<{ data: Parcel[]; total: number; page: number; size: number }> {
    try {
      const queryParams = this.buildParcelFiltersQuery(filters);
      return await this.get<{
        data: Parcel[];
        total: number;
        page: number;
        size: number;
      }>(`${this.PARCELS_ENDPOINT}?${queryParams.toString()}`);
    } catch (error) {
      console.error("Failed to fetch parcels:", error);
      throw error;
    }
  }

  async getParcelById(parcelId: string): Promise<ParcelDetails> {
    try {
      return await this.get<ParcelDetails>(
        `${this.PARCELS_ENDPOINT}/${parcelId}`
      );
    } catch (error) {
      console.error(`Failed to fetch parcel with ID ${parcelId}:`, error);
      throw error;
    }
  }

  async createParcel(parcelData: Partial<Parcel>): Promise<Parcel> {
    try {
      return await this.post<Parcel>(this.PARCELS_ENDPOINT, parcelData);
    } catch (error) {
      console.error("Failed to create parcel:", error);
      throw error;
    }
  }


  // Historique des cultures
  async getCropHistory(parcelId: string): Promise<CropHistory[]> {
    try {
      return await this.get<CropHistory[]>(
        `${this.PARCELS_ENDPOINT}/${parcelId}/crops`
      );
    } catch (error) {
      console.error(
        `Failed to fetch crop history for parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }

 

  async addCropToParcel(
    parcelId: string,
    cropData: Partial<Crop>
  ): Promise<Crop> {
    try {
      return await this.post<Crop>(
        `${this.PARCELS_ENDPOINT}/${parcelId}/crops`,
        cropData
      );
    } catch (error) {
      console.error(`Failed to add crop to parcel with ID ${parcelId}:`, error);
      throw error;
    }
  }
//------------------------------autre apis parcels----------------------------
    async updateParcel(
    parcelId: string,
    parcelData: Partial<Parcel>
  ): Promise<Parcel> {
    try {
      return await this.put<Parcel>(
        `${this.PARCELS_ENDPOINT}/${parcelId}`,
        parcelData
      );
    } catch (error) {
      console.error(`Failed to update parcel with ID ${parcelId}:`, error);
      throw error;
    }
  }

  async deleteParcel(parcelId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.PARCELS_ENDPOINT}/${parcelId}`);
    } catch (error) {
      console.error(`Failed to delete parcel with ID ${parcelId}:`, error);
      throw error;
    }
  }







//------------------------------autre apis crops----------------------------
   // Cultures d'une parcelle
  async getParcelCrops(parcelId: string): Promise<Crop[]> {
    try {
      return await this.get<Crop[]>(
        `${this.PARCELS_ENDPOINT}/${parcelId}/crops-history`
      );
    } catch (error) {
      console.error(
        `Failed to fetch crops for parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }

  async updateCropHistory(
    parcelId: string,
    cropHistoryId: string,
    cropData: Partial<CropHistory>
  ): Promise<CropHistory> {
    try {
      return await this.put<CropHistory>(
        `${this.PARCELS_ENDPOINT}/${parcelId}/crop-history/${cropHistoryId}`,
        cropData
      );
    } catch (error) {
      console.error(
        `Failed to update crop history with ID ${cropHistoryId}:`,
        error
      );
      throw error;
    }
  }

  // Données du sol
  async getSoilData(parcelId: string): Promise<SoilData[]> {
    try {
      return await this.get<SoilData[]>(
        `${this.PARCELS_ENDPOINT}/${parcelId}/soil-data`
      );
    } catch (error) {
      console.error(
        `Failed to fetch soil data for parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }

  async addSoilData(
    parcelId: string,
    soilData: Partial<Soil>
  ): Promise<SoilData> {
    try {
      return await this.post<SoilData>(
        `${this.PARCELS_ENDPOINT}/${parcelId}/soil-data`,
        soilData
      );
    } catch (error) {
      console.error(
        `Failed to add soil data to parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }

  // Cultures disponibles
  async getAvailableCrops(): Promise<Crop[]> {
    try {
      return await this.get<Crop[]>(this.CROPS_ENDPOINT);
    } catch (error) {
      console.error("Failed to fetch available crops:", error);
      throw error;
    }
  }

  async getCropById(cropId: string): Promise<Crop> {
    try {
      return await this.get<Crop>(`${this.CROPS_ENDPOINT}/${cropId}`);
    } catch (error) {
      console.error(`Failed to fetch crop with ID ${cropId}:`, error);
      throw error;
    }
  }

  // Obtenir les parcelles par zone d'irrigation
  async getParcelsByIrrigationZone(zoneId: string): Promise<Parcel[]> {
    try {
      return await this.get<Parcel[]>(`/irrigation/zones/${zoneId}/parcels`);
    } catch (error) {
      console.error(
        `Failed to fetch parcels for irrigation zone with ID ${zoneId}:`,
        error
      );
      throw error;
    }
  }

  // Obtenir les statistiques d'une parcelle
  async getParcelStats(parcelId: string): Promise<{
    waterUsageHistory: Array<{ date: string; usage: number }>;
    cropYields: Array<{ cropId: string; yield: number }>;
    soilHealthHistory: Array<{ date: string; health: number }>;
  }> {
    try {
      return await this.get(`${this.PARCELS_ENDPOINT}/${parcelId}/stats`);
    } catch (error) {
      console.error(
        `Failed to fetch stats for parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }

  // Mettre à jour le statut d'une parcelle
  async updateParcelStatus(
    parcelId: string,
    status: "active" | "inactive"
  ): Promise<void> {
    try {
      await this.patch(`${this.PARCELS_ENDPOINT}/${parcelId}/status`, {
        status,
      });
    } catch (error) {
      console.error(
        `Failed to update status for parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }

  // Obtenir toutes les parcelles dans une zone géographique
  async getParcelsInArea(
    latitude: number,
    longitude: number,
    radiusInKm: number
  ): Promise<Parcel[]> {
    try {
      return await this.get(`${this.PARCELS_ENDPOINT}/area`, {
        params: { latitude, longitude, radius: radiusInKm },
      });
    } catch (error) {
      console.error("Failed to fetch parcels in area:", error);
      throw error;
    }
  }

  // Archiver une parcelle
  async archiveParcel(parcelId: string): Promise<void> {
    try {
      await this.post<void>(`${this.PARCELS_ENDPOINT}/${parcelId}/archive`, {});
    } catch (error) {
      console.error(`Failed to archive parcel with ID ${parcelId}:`, error);
      throw error;
    }
  }

  // Exporter les données d'une parcelle
  async exportParcelData(
    parcelId: string,
    format: "csv" | "json" | "pdf"
  ): Promise<Blob> {
    try {
      return await this.get(`${this.PARCELS_ENDPOINT}/${parcelId}/export`, {
        params: { format },
        responseType: "blob",
      });
    } catch (error) {
      console.error(
        `Failed to export data for parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }

  // Importer des données pour une parcelle
  async importParcelData(parcelId: string, file: File): Promise<void> {
    try {
      await this.uploadFile(
        `${this.PARCELS_ENDPOINT}/${parcelId}/import`,
        file
      );
    } catch (error) {
      console.error(
        `Failed to import data for parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }

  // Obtenir un résumé des ressources d'une parcelle
  async getParcelResources(parcelId: string): Promise<{
    water: { usage: number; efficiency: number };
    soil: { health: number; moisture: number };
    crops: { count: number; health: number };
  }> {
    try {
      return await this.get(`${this.PARCELS_ENDPOINT}/${parcelId}/resources`);
    } catch (error) {
      console.error(
        `Failed to fetch resources for parcel with ID ${parcelId}:`,
        error
      );
      throw error;
    }
  }
}

// Exporter une instance singleton du service
export const parcelsService = new ParcelsService();
