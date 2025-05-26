"use client"

import { useState, useEffect, useCallback } from "react"
import { aquaponicsService } from "@/services/aquaponics-service"
import type { AquaponicsSystem, FishMonitoring, WaterQualityMonitoring, AquaponicsFilter } from "@/types/aquaponics"

export function useAquaponicsSystems(filter?: AquaponicsFilter) {
  const [systems, setSystems] = useState<AquaponicsSystem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSystems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await aquaponicsService.getSystems(filter)
      setSystems(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch aquaponics systems"))
      console.error("Error fetching aquaponics systems:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchSystems()
  }, [fetchSystems])

  const createSystem = async (system: Partial<AquaponicsSystem>) => {
    try {
      await aquaponicsService.createSystem(system)
      await fetchSystems()
      return true
    } catch (err) {
      console.error("Error creating aquaponics system:", err)
      return false
    }
  }

  const updateSystem = async (systemId: string, system: Partial<AquaponicsSystem>) => {
    try {
      await aquaponicsService.updateSystem(systemId, system)
      await fetchSystems()
      return true
    } catch (err) {
      console.error(`Error updating aquaponics system ${systemId}:`, err)
      return false
    }
  }

  const deleteSystem = async (systemId: string) => {
    try {
      await aquaponicsService.deleteSystem(systemId)
      await fetchSystems()
      return true
    } catch (err) {
      console.error(`Error deleting aquaponics system ${systemId}:`, err)
      return false
    }
  }

  return {
    systems,
    loading,
    error,
    refreshSystems: fetchSystems,
    createSystem,
    updateSystem,
    deleteSystem,
  }
}

export function useFishMonitoring(systemId: string) {
  const [monitoring, setMonitoring] = useState<FishMonitoring | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMonitoring = useCallback(async () => {
    if (!systemId) return

    try {
      setLoading(true)
      const data = await aquaponicsService.getFishMonitoring(systemId)
      setMonitoring(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch fish monitoring for system ${systemId}`))
      console.error(`Error fetching fish monitoring for system ${systemId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [systemId])

  useEffect(() => {
    fetchMonitoring()
  }, [fetchMonitoring])

  return {
    monitoring,
    loading,
    error,
    refreshMonitoring: fetchMonitoring,
  }
}

export function useWaterQualityMonitoring(systemId: string) {
  const [monitoring, setMonitoring] = useState<WaterQualityMonitoring | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMonitoring = useCallback(async () => {
    if (!systemId) return

    try {
      setLoading(true)
      const data = await aquaponicsService.getWaterQualityMonitoring(systemId)
      setMonitoring(data)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to fetch water quality monitoring for system ${systemId}`),
      )
      console.error(`Error fetching water quality monitoring for system ${systemId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [systemId])

  useEffect(() => {
    fetchMonitoring()
  }, [fetchMonitoring])

  return {
    monitoring,
    loading,
    error,
    refreshMonitoring: fetchMonitoring,
  }
}
