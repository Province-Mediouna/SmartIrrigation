import { ApiService } from "./api-service"
import type { MarketPrice, MarketDemand, MarketRecommendation } from "../types/market"

class MarketService extends ApiService {
  private readonly MARKET_ENDPOINT = "/market"

  // Prix du marché
  async getMarketPrices(cropType?: string, region?: string): Promise<MarketPrice[]> {
    try {
      const params: Record<string, string> = {}

      if (cropType) {
        params.cropType = cropType
      }

      if (region) {
        params.region = region
      }

      return await this.get<MarketPrice[]>(`${this.MARKET_ENDPOINT}/prices`, { params })
    } catch (error) {
      console.error("Failed to fetch market prices:", error)
      throw error
    }
  }

  // Demande du marché
  async getMarketDemand(cropType?: string): Promise<MarketDemand[]> {
    try {
      const params: Record<string, string> = {}

      if (cropType) {
        params.cropType = cropType
      }

      return await this.get<MarketDemand[]>(`${this.MARKET_ENDPOINT}/demands`, { params })
    } catch (error) {
      console.error("Failed to fetch market demand:", error)
      throw error
    }
  }

  // Recommandations de cultures rentables
  async getMarketRecommendations(): Promise<MarketRecommendation[]> {
    try {
      return await this.get<MarketRecommendation[]>(`${this.MARKET_ENDPOINT}/recommendations`)
    } catch (error) {
      console.error("Failed to fetch market recommendations:", error)
      throw error
    }
  }

  // Prévisions de prix
  async getPriceForecast(cropType: string, months = 6): Promise<MarketPrice[]> {
    try {
      return await this.get<MarketPrice[]>(`${this.MARKET_ENDPOINT}/prices/forecast`, {
        params: { cropType, months: months.toString() },
      })
    } catch (error) {
      console.error(`Failed to fetch price forecast for crop type ${cropType}:`, error)
      throw error
    }
  }

  // Tendances du marché
  async getMarketTrends(): Promise<any> {
    try {
      return await this.get<any>(`${this.MARKET_ENDPOINT}/trends`)
    } catch (error) {
      console.error("Failed to fetch market trends:", error)
      throw error
    }
  }

  // Opportunités de marché
  async getMarketOpportunities(region?: string): Promise<any> {
    try {
      const params: Record<string, string> = {}

      if (region) {
        params.region = region
      }

      return await this.get<any>(`${this.MARKET_ENDPOINT}/opportunities`, { params })
    } catch (error) {
      console.error("Failed to fetch market opportunities:", error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const marketService = new MarketService()
