"use client"

import { useState, useEffect, useCallback } from "react"
import { analyticsService } from "@/services/analytics-service"
import type {
  WaterUsageData,
  YieldPrediction,
  SoilHealthData,
  WeatherPatternData,
  CropComparisonData,
  EfficiencyMetrics,
  AnalyticsParameters,
  AnalyticsTimeframe,
} from "@/types/analytics"

export function useWaterUsage(timeframe: AnalyticsTimeframe, params?: AnalyticsParameters) {
  const [data, setData] = useState<WaterUsageData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await analyticsService.getWaterUsage(timeframe, params)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch water usage data"))
      console.error("Error fetching water usage data:", err)
    } finally {
      setLoading(false)
    }
  }, [timeframe, params])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refreshData: fetchData,
  }
}

export function useWaterUsageByParcel(parcelId: string, timeframe: AnalyticsTimeframe) {
  const [data, setData] = useState<WaterUsageData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!parcelId) return

    try {
      setLoading(true)
      const result = await analyticsService.getWaterUsageByParcel(parcelId, timeframe)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch water usage data for parcel ${parcelId}`))
      console.error(`Error fetching water usage data for parcel ${parcelId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [parcelId, timeframe])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refreshData: fetchData,
  }
}

export function useYieldPredictions(params?: AnalyticsParameters) {
  const [predictions, setPredictions] = useState<YieldPrediction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true)
      const result = await analyticsService.getYieldPredictions(params)
      setPredictions(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch yield predictions"))
      console.error("Error fetching yield predictions:", err)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchPredictions()
  }, [fetchPredictions])

  return {
    predictions,
    loading,
    error,
    refreshPredictions: fetchPredictions,
  }
}

export function useSoilHealth(timeframe: AnalyticsTimeframe, params?: AnalyticsParameters) {
  const [data, setData] = useState<SoilHealthData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await analyticsService.getSoilHealth(timeframe, params)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch soil health data"))
      console.error("Error fetching soil health data:", err)
    } finally {
      setLoading(false)
    }
  }, [timeframe, params])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refreshData: fetchData,
  }
}

export function useWeatherPatterns(timeframe: AnalyticsTimeframe, params?: AnalyticsParameters) {
  const [patterns, setPatterns] = useState<WeatherPatternData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPatterns = useCallback(async () => {
    try {
      setLoading(true)
      const result = await analyticsService.getWeatherPatterns(timeframe, params)
      setPatterns(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch weather pattern data"))
      console.error("Error fetching weather pattern data:", err)
    } finally {
      setLoading(false)
    }
  }, [timeframe, params])

  useEffect(() => {
    fetchPatterns()
  }, [fetchPatterns])

  return {
    patterns,
    loading,
    error,
    refreshPatterns: fetchPatterns,
  }
}

export function useCropComparison(params?: AnalyticsParameters) {
  const [data, setData] = useState<CropComparisonData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await analyticsService.getCropComparison(params)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch crop comparison data"))
      console.error("Error fetching crop comparison data:", err)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refreshData: fetchData,
  }
}

export function useEfficiencyMetrics(timeframe: AnalyticsTimeframe, params?: AnalyticsParameters) {
  const [metrics, setMetrics] = useState<EfficiencyMetrics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      const result = await analyticsService.getEfficiencyMetrics(timeframe, params)
      setMetrics(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch efficiency metrics"))
      console.error("Error fetching efficiency metrics:", err)
    } finally {
      setLoading(false)
    }
  }, [timeframe, params])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return {
    metrics,
    loading,
    error,
    refreshMetrics: fetchMetrics,
  }
}

export function useCustomReport() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const generateReport = async (params: Record<string, any>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await analyticsService.generateCustomReport(params)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to generate custom report"))
      console.error("Error generating custom report:", err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    generateReport,
    loading,
    error,
  }
}
