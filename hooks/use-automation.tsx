"use client"

import { useState, useEffect, useCallback } from "react"
import { automationService } from "@/services/automation-service"
import type { AutomationRule, AutomationScenario, AutomationFilter } from "@/types/automation"

export function useAutomationRules(filter?: AutomationFilter) {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true)
      const data = await automationService.getRules(filter)
      setRules(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch automation rules"))
      console.error("Error fetching automation rules:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  const createRule = async (rule: Partial<AutomationRule>) => {
    try {
      await automationService.createRule(rule)
      await fetchRules()
      return true
    } catch (err) {
      console.error("Error creating automation rule:", err)
      return false
    }
  }

  const updateRule = async (ruleId: string, rule: Partial<AutomationRule>) => {
    try {
      await automationService.updateRule(ruleId, rule)
      await fetchRules()
      return true
    } catch (err) {
      console.error(`Error updating automation rule ${ruleId}:`, err)
      return false
    }
  }

  const deleteRule = async (ruleId: string) => {
    try {
      await automationService.deleteRule(ruleId)
      await fetchRules()
      return true
    } catch (err) {
      console.error(`Error deleting automation rule ${ruleId}:`, err)
      return false
    }
  }

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      if (enabled) {
        await automationService.enableRule(ruleId)
      } else {
        await automationService.disableRule(ruleId)
      }
      await fetchRules()
      return true
    } catch (err) {
      console.error(`Error toggling automation rule ${ruleId}:`, err)
      return false
    }
  }

  return {
    rules,
    loading,
    error,
    refreshRules: fetchRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
  }
}

export function useAutomationScenarios(filter?: AutomationFilter) {
  const [scenarios, setScenarios] = useState<AutomationScenario[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchScenarios = useCallback(async () => {
    try {
      setLoading(true)
      const data = await automationService.getScenarios(filter)
      setScenarios(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch automation scenarios"))
      console.error("Error fetching automation scenarios:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchScenarios()
  }, [fetchScenarios])

  const createScenario = async (scenario: Partial<AutomationScenario>) => {
    try {
      await automationService.createScenario(scenario)
      await fetchScenarios()
      return true
    } catch (err) {
      console.error("Error creating automation scenario:", err)
      return false
    }
  }

  const updateScenario = async (scenarioId: string, scenario: Partial<AutomationScenario>) => {
    try {
      await automationService.updateScenario(scenarioId, scenario)
      await fetchScenarios()
      return true
    } catch (err) {
      console.error(`Error updating automation scenario ${scenarioId}:`, err)
      return false
    }
  }

  const deleteScenario = async (scenarioId: string) => {
    try {
      await automationService.deleteScenario(scenarioId)
      await fetchScenarios()
      return true
    } catch (err) {
      console.error(`Error deleting automation scenario ${scenarioId}:`, err)
      return false
    }
  }

  const executeScenario = async (scenarioId: string) => {
    try {
      await automationService.executeScenario(scenarioId)
      return true
    } catch (err) {
      console.error(`Error executing automation scenario ${scenarioId}:`, err)
      return false
    }
  }

  return {
    scenarios,
    loading,
    error,
    refreshScenarios: fetchScenarios,
    createScenario,
    updateScenario,
    deleteScenario,
    executeScenario,
  }
}
