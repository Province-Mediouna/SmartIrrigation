"use client"

import { useState, useEffect, useCallback } from "react"
import { environmentService } from "@/services/environment-service"
import type { SoilData, BiodiversityData, EnvironmentFilter } from "@/types/environment"

export function useSoilData(filter?: EnvironmentFilter) {
  const [soilData, setSoilData] = useState<SoilData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSoilData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await environmentService.getSoilData(filter)
      setSoilData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch soil data"))
      console.error("Error fetching soil data:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchSoilData()
  }, [fetchSoilData])

  return {
    soilData,
    loading,
    error,
    refreshSoilData: fetchSoilData,
  }
}

export function useBiodiversityData(filter?: EnvironmentFilter) {
  const [biodiversityData, setBiodiversityData] = useState<BiodiversityData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBiodiversityData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await environmentService.getBiodiversityData(filter)
      setBiodiversityData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch biodiversity data"))
      console.error("Error fetching biodiversity data:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchBiodiversityData()
  }, [fetchBiodiversityData])

  return {
    biodiversityData,
    loading,
    error,
    refreshBiodiversityData: fetchBiodiversityData,
  }
}
