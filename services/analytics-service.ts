import { ApiService } from "./api-service"
import type {
  WaterUsageData,
  YieldPrediction,
  SoilHealthData,
  WeatherPatternData,
  CropComparisonData,
  EfficiencyMetrics,
  AnalyticsParameters,
  AnalyticsTimeframe,
  PredictionRequest,
  ComparisonRequest,
} from "../types/analytics"

class AnalyticsService extends ApiService {
  private readonly ANALYTICS_ENDPOINT = "/analytics"

  // Utilisation de l'eau
  async getWaterUsage(timeframe: AnalyticsTimeframe, params?: AnalyticsParameters): Promise<WaterUsageData[]> {
    try {
      return await this.get<WaterUsageData[]>(`${this.ANALYTICS_ENDPOINT}/water-usage`, {
        params: { ...params, timeframe },
      })
    } catch (error) {
      console.error("Failed to fetch water usage data:", error)
      throw error
    }
  }

  async getWaterUsageByParcel(parcelId: string, timeframe: AnalyticsTimeframe): Promise<WaterUsageData[]> {
    try {
      return await this.get<WaterUsageData[]>(`${this.ANALYTICS_ENDPOINT}/water-usage/parcel/${parcelId}`, {
        params: { timeframe },
      })
    } catch (error) {
      console.error(`Failed to fetch water usage data for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  async getWaterUsageByZone(zoneId: string, timeframe: AnalyticsTimeframe): Promise<WaterUsageData[]> {
    try {
      return await this.get<WaterUsageData[]>(`${this.ANALYTICS_ENDPOINT}/water-usage/zone/${zoneId}`, {
        params: { timeframe },
      })
    } catch (error) {
      console.error(`Failed to fetch water usage data for zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  // Prédictions de rendement
  async getYieldPredictions(params?: AnalyticsParameters): Promise<YieldPrediction[]> {
    try {
      return await this.get<YieldPrediction[]>(`${this.ANALYTICS_ENDPOINT}/yield-predictions`, {
        params,
      })
    } catch (error) {
      console.error("Failed to fetch yield predictions:", error)
      throw error
    }
  }

  async getYieldPredictionsByParcel(parcelId: string): Promise<YieldPrediction[]> {
    try {
      return await this.get<YieldPrediction[]>(`${this.ANALYTICS_ENDPOINT}/yield-predictions/parcel/${parcelId}`)
    } catch (error) {
      console.error(`Failed to fetch yield predictions for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  async getYieldPredictionsByCrop(cropId: string): Promise<YieldPrediction[]> {
    try {
      return await this.get<YieldPrediction[]>(`${this.ANALYTICS_ENDPOINT}/yield-predictions/crop/${cropId}`)
    } catch (error) {
      console.error(`Failed to fetch yield predictions for crop with ID ${cropId}:`, error)
      throw error
    }
  }

  // Santé du sol
  async getSoilHealth(timeframe: AnalyticsTimeframe, params?: AnalyticsParameters): Promise<SoilHealthData[]> {
    try {
      return await this.get<SoilHealthData[]>(`${this.ANALYTICS_ENDPOINT}/soil-health`, {
        params: { ...params, timeframe },
      })
    } catch (error) {
      console.error("Failed to fetch soil health data:", error)
      throw error
    }
  }

  async getSoilHealthByParcel(parcelId: string, timeframe: AnalyticsTimeframe): Promise<SoilHealthData[]> {
    try {
      return await this.get<SoilHealthData[]>(`${this.ANALYTICS_ENDPOINT}/soil-health/parcel/${parcelId}`, {
        params: { timeframe },
      })
    } catch (error) {
      console.error(`Failed to fetch soil health data for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  // Tendances météorologiques
  async getWeatherPatterns(timeframe: AnalyticsTimeframe, params?: AnalyticsParameters): Promise<WeatherPatternData[]> {
    try {
      return await this.get<WeatherPatternData[]>(`${this.ANALYTICS_ENDPOINT}/weather-patterns`, {
        params: { ...params, timeframe },
      })
    } catch (error) {
      console.error("Failed to fetch weather pattern data:", error)
      throw error
    }
  }

  // Comparaison des cultures
  async getCropComparison(params?: AnalyticsParameters): Promise<CropComparisonData[]> {
    try {
      return await this.get<CropComparisonData[]>(`${this.ANALYTICS_ENDPOINT}/crop-comparison`, {
        params,
      })
    } catch (error) {
      console.error("Failed to fetch crop comparison data:", error)
      throw error
    }
  }

  async getCropComparisonByParcel(parcelId: string): Promise<CropComparisonData[]> {
    try {
      return await this.get<CropComparisonData[]>(`${this.ANALYTICS_ENDPOINT}/crop-comparison/parcel/${parcelId}`)
    } catch (error) {
      console.error(`Failed to fetch crop comparison data for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  // Métriques d'efficacité
  async getEfficiencyMetrics(timeframe: AnalyticsTimeframe, params?: AnalyticsParameters): Promise<EfficiencyMetrics> {
    try {
      return await this.get<EfficiencyMetrics>(`${this.ANALYTICS_ENDPOINT}/efficiency-metrics`, {
        params: { ...params, timeframe },
      })
    } catch (error) {
      console.error("Failed to fetch efficiency metrics:", error)
      throw error
    }
  }

  async getEfficiencyMetricsByParcel(parcelId: string, timeframe: AnalyticsTimeframe): Promise<EfficiencyMetrics> {
    try {
      return await this.get<EfficiencyMetrics>(`${this.ANALYTICS_ENDPOINT}/efficiency-metrics/parcel/${parcelId}`, {
        params: { timeframe },
      })
    } catch (error) {
      console.error(`Failed to fetch efficiency metrics for parcel with ID ${parcelId}:`, error)
      throw error
    }
  }

  async getEfficiencyMetricsByZone(zoneId: string, timeframe: AnalyticsTimeframe): Promise<EfficiencyMetrics> {
    try {
      return await this.get<EfficiencyMetrics>(`${this.ANALYTICS_ENDPOINT}/efficiency-metrics/zone/${zoneId}`, {
        params: { timeframe },
      })
    } catch (error) {
      console.error(`Failed to fetch efficiency metrics for zone with ID ${zoneId}:`, error)
      throw error
    }
  }

  // Rapports personnalisés
  async generateCustomReport(params: Record<string, any>): Promise<any> {
    try {
      return await this.post<any>(`${this.ANALYTICS_ENDPOINT}/custom-report`, params)
    } catch (error) {
      console.error("Failed to generate custom report:", error)
      throw error
    }
  }

  // Prédictions personnalisées (POST)
  async postPredictions(request: PredictionRequest): Promise<YieldPrediction[]> {
    try {
      return await this.post<YieldPrediction[]>(`${this.ANALYTICS_ENDPOINT}/predictions`, request)
    } catch (error) {
      console.error("Failed to fetch predictions (POST):", error)
      throw error
    }
  }

  // Comparaison de périodes (POST)
  async postComparisons(request: ComparisonRequest): Promise<CropComparisonData[]> {
    try {
      return await this.post<CropComparisonData[]>(`${this.ANALYTICS_ENDPOINT}/comparisons`, request)
    } catch (error) {
      console.error("Failed to fetch comparisons (POST):", error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const analyticsService = new AnalyticsService()
