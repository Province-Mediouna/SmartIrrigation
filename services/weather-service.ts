import { ApiService } from "./api-service"
import type { WeatherForecast, WeatherPattern } from "../types/weather"

class WeatherService extends ApiService {
  private readonly WEATHER_ENDPOINT = "/weather"
  private readonly FORECAST_ENDPOINT = "/weather/forecast"
  private readonly HISTORY_ENDPOINT = "/weather/history"
  private readonly ALERTS_ENDPOINT = "/weather/alerts"
  private readonly STATIONS_ENDPOINT = "/weather/stations"

  // Prévisions météorologiques
  async getForecast(params?: any): Promise<any[]> {
    try {
      return await this.get<any[]>(this.FORECAST_ENDPOINT, { params })
    } catch (error) {
      console.error("Failed to fetch weather forecast:", error)
      throw error
    }
  }

  async getForecastByLocation(latitude: number, longitude: number, days = 7): Promise<any[]> {
    try {
      return await this.get<any[]>(`${this.FORECAST_ENDPOINT}/location`, {
        params: { latitude, longitude, days },
      })
    } catch (error) {
      console.error(`Failed to fetch weather forecast for location (${latitude}, ${longitude}):`, error)
      throw error
    }
  }

  // Historique météorologique
  async getWeatherHistory(startDate: Date, endDate: Date, params?: any): Promise<any[]> {
    try {
      return await this.get<any[]>(this.HISTORY_ENDPOINT, {
        params: {
          ...params,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      })
    } catch (error) {
      console.error("Failed to fetch weather history:", error)
      throw error
    }
  }

  async getWeatherHistoryByLocation(
    latitude: number,
    longitude: number,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    try {
      return await this.get<any[]>(`${this.HISTORY_ENDPOINT}/location`, {
        params: {
          latitude,
          longitude,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      })
    } catch (error) {
      console.error(`Failed to fetch weather history for location (${latitude}, ${longitude}):`, error)
      throw error
    }
  }

  // Alertes météorologiques
  async getWeatherAlerts(params?: any): Promise<any[]> {
    try {
      return await this.get<any[]>(this.ALERTS_ENDPOINT, { params })
    } catch (error) {
      console.error("Failed to fetch weather alerts:", error)
      throw error
    }
  }

  async getWeatherAlertsByLocation(latitude: number, longitude: number): Promise<any[]> {
    try {
      return await this.get<any[]>(`${this.ALERTS_ENDPOINT}/location`, {
        params: { latitude, longitude },
      })
    } catch (error) {
      console.error(`Failed to fetch weather alerts for location (${latitude}, ${longitude}):`, error)
      throw error
    }
  }

  // Stations météorologiques
  async getWeatherStations(): Promise<any[]> {
    try {
      return await this.get<any[]>(this.STATIONS_ENDPOINT)
    } catch (error) {
      console.error("Failed to fetch weather stations:", error)
      throw error
    }
  }

  async getWeatherStationById(stationId: string): Promise<any> {
    try {
      return await this.get<any>(`${this.STATIONS_ENDPOINT}/${stationId}`)
    } catch (error) {
      console.error(`Failed to fetch weather station with ID ${stationId}:`, error)
      throw error
    }
  }

  async getWeatherStationData(stationId: string, startDate: Date, endDate: Date): Promise<any[]> {
    try {
      return await this.get<any[]>(`${this.STATIONS_ENDPOINT}/${stationId}/data`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      })
    } catch (error) {
      console.error(`Failed to fetch data for weather station with ID ${stationId}:`, error)
      throw error
    }
  }

  // Conditions météorologiques actuelles
  async getCurrentWeather(params?: any): Promise<any> {
    try {
      return await this.get<any>(`${this.WEATHER_ENDPOINT}/current`, { params })
    } catch (error) {
      console.error("Failed to fetch current weather:", error)
      throw error
    }
  }

  async getCurrentWeatherByLocation(latitude: number, longitude: number): Promise<any> {
    try {
      return await this.get<any>(`${this.WEATHER_ENDPOINT}/current/location`, {
        params: { latitude, longitude },
      })
    } catch (error) {
      console.error(`Failed to fetch current weather for location (${latitude}, ${longitude}):`, error)
      throw error
    }
  }

  // Motifs climatiques (patterns)
  async getWeatherPatterns(period: string): Promise<any[]> {
    try {
      return await this.get<any[]>(`/weather/patterns`, { params: { period } })
    } catch (error) {
      console.error("Failed to fetch weather patterns:", error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const weatherService = new WeatherService()
