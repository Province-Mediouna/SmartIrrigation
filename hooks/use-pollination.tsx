"use client"

import { useState, useEffect, useCallback } from "react"
import { pollinationService } from "@/services/pollination-service"
import type { ArtificialPollinationSystem, PollinationSchedule, PollinationFilter } from "@/types/pollination"

export function useArtificialPollinationSystems(filter?: PollinationFilter) {
  const [systems, setSystems] = useState<ArtificialPollinationSystem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSystems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await pollinationService.getSystems(filter)
      setSystems(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch artificial pollination systems"))
      console.error("Error fetching artificial pollination systems:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchSystems()
  }, [fetchSystems])

  const createSystem = async (system: Partial<ArtificialPollinationSystem>) => {
    try {
      await pollinationService.createSystem(system)
      await fetchSystems()
      return true
    } catch (err) {
      console.error("Error creating artificial pollination system:", err)
      return false
    }
  }

  const updateSystem = async (systemId: string, system: Partial<ArtificialPollinationSystem>) => {
    try {
      await pollinationService.updateSystem(systemId, system)
      await fetchSystems()
      return true
    } catch (err) {
      console.error(`Error updating artificial pollination system ${systemId}:`, err)
      return false
    }
  }

  const deleteSystem = async (systemId: string) => {
    try {
      await pollinationService.deleteSystem(systemId)
      await fetchSystems()
      return true
    } catch (err) {
      console.error(`Error deleting artificial pollination system ${systemId}:`, err)
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

export function usePollinationSchedules(systemId?: string) {
  const [schedules, setSchedules] = useState<PollinationSchedule[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true)
      const data = systemId
        ? await pollinationService.getSchedulesBySystem(systemId)
        : await pollinationService.getSchedules()
      setSchedules(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch pollination schedules"))
      console.error("Error fetching pollination schedules:", err)
    } finally {
      setLoading(false)
    }
  }, [systemId])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const createSchedule = async (schedule: Partial<PollinationSchedule>) => {
    try {
      await pollinationService.createSchedule(schedule)
      await fetchSchedules()
      return true
    } catch (err) {
      console.error("Error creating pollination schedule:", err)
      return false
    }
  }

  const updateSchedule = async (scheduleId: string, schedule: Partial<PollinationSchedule>) => {
    try {
      await pollinationService.updateSchedule(scheduleId, schedule)
      await fetchSchedules()
      return true
    } catch (err) {
      console.error(`Error updating pollination schedule ${scheduleId}:`, err)
      return false
    }
  }

  const deleteSchedule = async (scheduleId: string) => {
    try {
      await pollinationService.deleteSchedule(scheduleId)
      await fetchSchedules()
      return true
    } catch (err) {
      console.error(`Error deleting pollination schedule ${scheduleId}:`, err)
      return false
    }
  }

  return {
    schedules,
    loading,
    error,
    refreshSchedules: fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  }
}
