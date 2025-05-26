"use client"

import { useState, useEffect, useCallback } from "react"
import { waterResourcesService } from "@/services/water-resources-service"
import type {
  WaterSource,
  WaterSourceDetails,
  WaterQualityData,
  WaterLevelData,
  WaterUsageReport,
} from "@/types/water-resource"

export function useWaterSources() {
  const [sources, setSources] = useState<WaterSource[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSources = useCallback(async () => {
    try {
      setLoading(true)
      const data = await waterResourcesService.getAllWaterSources()
      setSources(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch water sources"))
      console.error("Error fetching water sources:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSources()
  }, [fetchSources])

  const createSource = async (sourceData: Partial<WaterSource>) => {
    try {
      await waterResourcesService.createWaterSource(sourceData)
      await fetchSources()
      return true
    } catch (err) {
      console.error("Error creating water source:", err)
      return false
    }
  }

  const updateSource = async (sourceId: string, sourceData: Partial<WaterSource>) => {
    try {
      await waterResourcesService.updateWaterSource(sourceId, sourceData)
      await fetchSources()
      return true
    } catch (err) {
      console.error(`Error updating water source ${sourceId}:`, err)
      return false
    }
  }

  const deleteSource = async (sourceId: string) => {
    try {
      await waterResourcesService.deleteWaterSource(sourceId)
      await fetchSources()
      return true
    } catch (err) {
      console.error(`Error deleting water source ${sourceId}:`, err)
      return false
    }
  }

  return {
    sources,
    loading,
    error,
    refreshSources: fetchSources,
    createSource,
    updateSource,
    deleteSource,
  }
}

export function useWaterSourceDetails(sourceId: string) {
  const [source, setSource] = useState<WaterSourceDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSource = useCallback(async () => {
    if (!sourceId) return

    try {
      setLoading(true)
      const data = await waterResourcesService.getWaterSourceById(sourceId)
      setSource(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch water source ${sourceId}`))
      console.error(`Error fetching water source ${sourceId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [sourceId])

  useEffect(() => {
    fetchSource()
  }, [fetchSource])

  return {
    source,
    loading,
    error,
    refreshSource: fetchSource,
  }
}

export function useWaterQualityData(sourceId: string, startDate?: Date, endDate?: Date) {
  const [qualityData, setQualityData] = useState<WaterQualityData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchQualityData = useCallback(async () => {
    if (!sourceId) return

    try {
      setLoading(true)
      const data = await waterResourcesService.getWaterQualityData(sourceId, startDate, endDate)
      setQualityData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch water quality data for source ${sourceId}`))
      console.error(`Error fetching water quality data for source ${sourceId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [sourceId, startDate, endDate])

  useEffect(() => {
    fetchQualityData()
  }, [fetchQualityData])

  const addQualityData = async (data: Partial<WaterQualityData>) => {
    try {
      await waterResourcesService.addWaterQualityData(sourceId, data)
      await fetchQualityData()
      return true
    } catch (err) {
      console.error(`Error adding water quality data for source ${sourceId}:`, err)
      return false
    }
  }

  return {
    qualityData,
    loading,
    error,
    refreshQualityData: fetchQualityData,
    addQualityData,
  }
}

export function useWaterLevelData(sourceId: string, startDate?: Date, endDate?: Date) {
  const [levelData, setLevelData] = useState<WaterLevelData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLevelData = useCallback(async () => {
    if (!sourceId) return

    try {
      setLoading(true)
      const data = await waterResourcesService.getWaterLevelData(sourceId, startDate, endDate)
      setLevelData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch water level data for source ${sourceId}`))
      console.error(`Error fetching water level data for source ${sourceId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [sourceId, startDate, endDate])

  useEffect(() => {
    fetchLevelData()
  }, [fetchLevelData])

  const addLevelData = async (data: Partial<WaterLevelData>) => {
    try {
      await waterResourcesService.addWaterLevelData(sourceId, data)
      await fetchLevelData()
      return true
    } catch (err) {
      console.error(`Error adding water level data for source ${sourceId}:`, err)
      return false
    }
  }

  return {
    levelData,
    loading,
    error,
    refreshLevelData: fetchLevelData,
    addLevelData,
  }
}

export function useWaterUsageReport(sourceId: string, startDate: Date, endDate: Date) {
  const [report, setReport] = useState<WaterUsageReport | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchReport = useCallback(async () => {
    if (!sourceId) return

    try {
      setLoading(true)
      const data = await waterResourcesService.getWaterUsageReport(sourceId, startDate, endDate)
      setReport(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch water usage report for source ${sourceId}`))
      console.error(`Error fetching water usage report for source ${sourceId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [sourceId, startDate, endDate])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  return {
    report,
    loading,
    error,
    refreshReport: fetchReport,
  }
}
