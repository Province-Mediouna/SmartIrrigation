"use client"

import { useState, useEffect, useCallback } from "react"
import { cropPlanningService } from "@/services/crop-planning-service"
import type { RotationPlan, Season, CropPlanningFilter } from "@/types/crop-planning"

export function useRotationPlans(filter?: CropPlanningFilter) {
  const [plans, setPlans] = useState<RotationPlan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      const data = await cropPlanningService.getRotationPlans(filter)
      setPlans(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch rotation plans"))
      console.error("Error fetching rotation plans:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const createPlan = async (plan: Partial<RotationPlan>) => {
    try {
      await cropPlanningService.createRotationPlan(plan)
      await fetchPlans()
      return true
    } catch (err) {
      console.error("Error creating rotation plan:", err)
      return false
    }
  }

  const updatePlan = async (planId: string, plan: Partial<RotationPlan>) => {
    try {
      await cropPlanningService.updateRotationPlan(planId, plan)
      await fetchPlans()
      return true
    } catch (err) {
      console.error(`Error updating rotation plan ${planId}:`, err)
      return false
    }
  }

  const deletePlan = async (planId: string) => {
    try {
      await cropPlanningService.deleteRotationPlan(planId)
      await fetchPlans()
      return true
    } catch (err) {
      console.error(`Error deleting rotation plan ${planId}:`, err)
      return false
    }
  }

  return {
    plans,
    loading,
    error,
    refreshPlans: fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  }
}

export function useSeasons() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSeasons = useCallback(async () => {
    try {
      setLoading(true)
      const data = await cropPlanningService.getAllSeasons()
      setSeasons(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch seasons"))
      console.error("Error fetching seasons:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSeasons()
  }, [fetchSeasons])

  const createSeason = async (season: Partial<Season>) => {
    try {
      await cropPlanningService.createSeason(season)
      await fetchSeasons()
      return true
    } catch (err) {
      console.error("Error creating season:", err)
      return false
    }
  }

  const updateSeason = async (seasonId: string, season: Partial<Season>) => {
    try {
      await cropPlanningService.updateSeason(seasonId, season)
      await fetchSeasons()
      return true
    } catch (err) {
      console.error(`Error updating season ${seasonId}:`, err)
      return false
    }
  }

  const deleteSeason = async (seasonId: string) => {
    try {
      await cropPlanningService.deleteSeason(seasonId)
      await fetchSeasons()
      return true
    } catch (err) {
      console.error(`Error deleting season ${seasonId}:`, err)
      return false
    }
  }

  return {
    seasons,
    loading,
    error,
    refreshSeasons: fetchSeasons,
    createSeason,
    updateSeason,
    deleteSeason,
  }
}
