"use client"

import { useState, useEffect, useCallback } from "react"
import { marketService } from "@/services/market-service"
import type { MarketPrice, MarketDemand, MarketRecommendation, MarketFilter } from "@/types/market"

export function useMarketPrices(filter?: MarketFilter) {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true)
      const data = await marketService.getPrices(filter)
      setPrices(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch market prices"))
      console.error("Error fetching market prices:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  return {
    prices,
    loading,
    error,
    refreshPrices: fetchPrices,
  }
}

export function useMarketDemands(filter?: MarketFilter) {
  const [demands, setDemands] = useState<MarketDemand[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDemands = useCallback(async () => {
    try {
      setLoading(true)
      const data = await marketService.getDemands(filter)
      setDemands(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch market demands"))
      console.error("Error fetching market demands:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchDemands()
  }, [fetchDemands])

  return {
    demands,
    loading,
    error,
    refreshDemands: fetchDemands,
  }
}

export function useMarketRecommendations(filter?: MarketFilter) {
  const [recommendations, setRecommendations] = useState<MarketRecommendation[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true)
      const data = await marketService.getRecommendations(filter)
      setRecommendations(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch market recommendations"))
      console.error("Error fetching market recommendations:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations: fetchRecommendations,
  }
}
