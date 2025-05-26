"use client"

import { useState, useEffect, useCallback } from "react"
import { treatmentsService } from "@/services/treatments-service"
import type { Treatment, TreatmentFilter, TreatmentCompatibility } from "@/types/treatment"

export function useTreatments(filter?: TreatmentFilter) {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)

  const fetchTreatments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await treatmentsService.getTreatments(filter)
      setTreatments(response.data)
      setTotalCount(response.totalCount)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch treatments"))
      console.error("Error fetching treatments:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchTreatments()
  }, [fetchTreatments])

  const createTreatment = async (treatment: Partial<Treatment>) => {
    try {
      await treatmentsService.createTreatment(treatment)
      await fetchTreatments()
      return true
    } catch (err) {
      console.error("Error creating treatment:", err)
      return false
    }
  }

  const updateTreatment = async (treatmentId: string, treatment: Partial<Treatment>) => {
    try {
      await treatmentsService.updateTreatment(treatmentId, treatment)
      await fetchTreatments()
      return true
    } catch (err) {
      console.error(`Error updating treatment ${treatmentId}:`, err)
      return false
    }
  }

  const deleteTreatment = async (treatmentId: string) => {
    try {
      await treatmentsService.deleteTreatment(treatmentId)
      await fetchTreatments()
      return true
    } catch (err) {
      console.error(`Error deleting treatment ${treatmentId}:`, err)
      return false
    }
  }

  return {
    treatments,
    loading,
    error,
    totalCount,
    refreshTreatments: fetchTreatments,
    createTreatment,
    updateTreatment,
    deleteTreatment,
  }
}

export function useTreatmentCompatibility() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const checkCompatibility = async (treatmentIds: string[]): Promise<TreatmentCompatibility | null> => {
    try {
      setLoading(true)
      setError(null)
      return await treatmentsService.checkCompatibility(treatmentIds)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to check treatment compatibility"))
      console.error("Error checking treatment compatibility:", err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    checkCompatibility,
    loading,
    error,
  }
}
