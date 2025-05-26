"use client"

import { useState, useCallback } from "react"
import { greenhousesService } from "@/services/greenhouses-service"

export function useClimateControl() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const updateClimateControl = useCallback(async (greenhouseId: string, settings: any) => {
    try {
      setLoading(true)
      setError(null)
      await greenhousesService.updateClimateControl(greenhouseId, settings)
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to update climate control for greenhouse ${greenhouseId}`),
      )
      console.error(`Error updating climate control for greenhouse ${greenhouseId}:`, err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    updateClimateControl,
    loading,
    error,
  }
}

export function useVentilation() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const updateVentilation = useCallback(async (greenhouseId: string, settings: any) => {
    try {
      setLoading(true)
      setError(null)
      await greenhousesService.updateVentilation(greenhouseId, settings)
      return true
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update ventilation for greenhouse ${greenhouseId}`))
      console.error(`Error updating ventilation for greenhouse ${greenhouseId}:`, err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    updateVentilation,
    loading,
    error,
  }
}

export function useCO2Management() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const updateCO2Management = useCallback(async (greenhouseId: string, settings: any) => {
    try {
      setLoading(true)
      setError(null)
      await greenhousesService.updateCO2Management(greenhouseId, settings)
      return true
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update CO2 management for greenhouse ${greenhouseId}`))
      console.error(`Error updating CO2 management for greenhouse ${greenhouseId}:`, err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    updateCO2Management,
    loading,
    error,
  }
}
