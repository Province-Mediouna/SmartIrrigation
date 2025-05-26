"use client"

import { useState, useCallback } from "react"
import { risksService } from "@/services/risks-service"
import type { RiskAssessment, RiskMitigation } from "@/types/risk"

export function useRiskAssessment() {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const assessRisks = useCallback(async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await risksService.assessRisks(data)
      setAssessment(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to perform risk assessment"))
      console.error("Error performing risk assessment:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    assessment,
    loading,
    error,
    assessRisks,
    resetAssessment: () => setAssessment(null),
  }
}

export function useRiskMitigation() {
  const [mitigation, setMitigation] = useState<RiskMitigation | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const mitigateRisks = useCallback(async (assessmentId: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await risksService.mitigateRisks(assessmentId, data)
      setMitigation(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to generate risk mitigation plan"))
      console.error("Error generating risk mitigation plan:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    mitigation,
    loading,
    error,
    mitigateRisks,
    resetMitigation: () => setMitigation(null),
  }
}
