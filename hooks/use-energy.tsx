"use client"

import { useState, useEffect, useCallback } from "react"
import { energyService } from "@/services/energy-service"
import type { EnergyConsumption, EnergyOptimization, SolarIntegration } from "@/types/energy"

export function useEnergyConsumption(startDate?: Date, endDate?: Date) {
  const [consumption, setConsumption] = useState<EnergyConsumption | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchConsumption = useCallback(async () => {
    try {
      setLoading(true)
      const data = await energyService.getConsumption(startDate, endDate)
      setConsumption(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch energy consumption"))
      console.error("Error fetching energy consumption:", err)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchConsumption()
  }, [fetchConsumption])

  return {
    consumption,
    loading,
    error,
    refreshConsumption: fetchConsumption,
  }
}

export function useEnergyOptimization() {
  const [optimization, setOptimization] = useState<EnergyOptimization | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const optimizeEnergy = useCallback(async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await energyService.optimizeEnergy(data)
      setOptimization(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to optimize energy"))
      console.error("Error optimizing energy:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    optimization,
    loading,
    error,
    optimizeEnergy,
    resetOptimization: () => setOptimization(null),
  }
}

export function useSolarIntegration() {
  const [integration, setIntegration] = useState<SolarIntegration | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const integrateSolar = useCallback(async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await energyService.integrateSolar(data)
      setIntegration(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to integrate solar energy"))
      console.error("Error integrating solar energy:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    integration,
    loading,
    error,
    integrateSolar,
    resetIntegration: () => setIntegration(null),
  }
}
