"use client"

import { useState, useEffect, useCallback } from "react"
import { verticalFarmingService } from "@/services/vertical-farming-service"
import type { VerticalFarmingSystem, VerticalFarmingLayer, VerticalFarmingFilter } from "@/types/vertical-farming"

export function useVerticalFarmingSystems(filter?: VerticalFarmingFilter) {
  const [systems, setSystems] = useState<VerticalFarmingSystem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSystems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await verticalFarmingService.getSystems(filter)
      setSystems(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch vertical farming systems"))
      console.error("Error fetching vertical farming systems:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchSystems()
  }, [fetchSystems])

  const createSystem = async (system: Partial<VerticalFarmingSystem>) => {
    try {
      await verticalFarmingService.createSystem(system)
      await fetchSystems()
      return true
    } catch (err) {
      console.error("Error creating vertical farming system:", err)
      return false
    }
  }

  const updateSystem = async (systemId: string, system: Partial<VerticalFarmingSystem>) => {
    try {
      await verticalFarmingService.updateSystem(systemId, system)
      await fetchSystems()
      return true
    } catch (err) {
      console.error(`Error updating vertical farming system ${systemId}:`, err)
      return false
    }
  }

  const deleteSystem = async (systemId: string) => {
    try {
      await verticalFarmingService.deleteSystem(systemId)
      await fetchSystems()
      return true
    } catch (err) {
      console.error(`Error deleting vertical farming system ${systemId}:`, err)
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

export function useVerticalFarmingLayers(systemId: string) {
  const [layers, setLayers] = useState<VerticalFarmingLayer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLayers = useCallback(async () => {
    if (!systemId) return

    try {
      setLoading(true)
      const data = await verticalFarmingService.getLayers(systemId)
      setLayers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch layers for system ${systemId}`))
      console.error(`Error fetching layers for system ${systemId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [systemId])

  useEffect(() => {
    fetchLayers()
  }, [fetchLayers])

  const createLayer = async (layer: Partial<VerticalFarmingLayer>) => {
    try {
      await verticalFarmingService.createLayer(systemId, layer)
      await fetchLayers()
      return true
    } catch (err) {
      console.error(`Error creating layer for system ${systemId}:`, err)
      return false
    }
  }

  const updateLayer = async (layerId: string, layer: Partial<VerticalFarmingLayer>) => {
    try {
      await verticalFarmingService.updateLayer(systemId, layerId, layer)
      await fetchLayers()
      return true
    } catch (err) {
      console.error(`Error updating layer ${layerId} for system ${systemId}:`, err)
      return false
    }
  }

  const deleteLayer = async (layerId: string) => {
    try {
      await verticalFarmingService.deleteLayer(systemId, layerId)
      await fetchLayers()
      return true
    } catch (err) {
      console.error(`Error deleting layer ${layerId} for system ${systemId}:`, err)
      return false
    }
  }

  return {
    layers,
    loading,
    error,
    refreshLayers: fetchLayers,
    createLayer,
    updateLayer,
    deleteLayer,
  }
}

export function useLightingSchedule(systemId: string) {
  const [schedule, setSchedule] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSchedule = useCallback(async () => {
    if (!systemId) return

    try {
      setLoading(true)
      const data = await verticalFarmingService.getLightingSchedule(systemId)
      setSchedule(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch lighting schedule for system ${systemId}`))
      console.error(`Error fetching lighting schedule for system ${systemId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [systemId])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  const updateSchedule = async (scheduleData: any) => {
    try {
      await verticalFarmingService.updateLightingSchedule(systemId, scheduleData)
      await fetchSchedule()
      return true
    } catch (err) {
      console.error(`Error updating lighting schedule for system ${systemId}:`, err)
      return false
    }
  }

  return {
    schedule,
    loading,
    error,
    refreshSchedule: fetchSchedule,
    updateSchedule,
  }
}
