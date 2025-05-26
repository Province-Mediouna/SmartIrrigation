"use client"

import { useState, useEffect, useCallback } from "react"
import { alertsService } from "@/services/alerts-service"
import type { Alert, AlertRule, AlertSeverity, AlertStatus, AlertType, AlertStats } from "@/types/alert"

export function useAlerts(status?: AlertStatus, severity?: AlertSeverity, type?: AlertType) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await alertsService.getAllAlerts(status, severity, type)
      setAlerts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch alerts"))
      console.error("Error fetching alerts:", err)
    } finally {
      setLoading(false)
    }
  }, [status, severity, type])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await alertsService.acknowledgeAlert(alertId)
      await fetchAlerts()
      return true
    } catch (err) {
      console.error(`Error acknowledging alert ${alertId}:`, err)
      return false
    }
  }

  const resolveAlert = async (alertId: string, resolution?: string) => {
    try {
      await alertsService.resolveAlert(alertId, resolution)
      await fetchAlerts()
      return true
    } catch (err) {
      console.error(`Error resolving alert ${alertId}:`, err)
      return false
    }
  }

  const updateAlertStatus = async (alertId: string, status: AlertStatus) => {
    try {
      await alertsService.updateAlertStatus(alertId, status)
      await fetchAlerts()
      return true
    } catch (err) {
      console.error(`Error updating alert ${alertId} status:`, err)
      return false
    }
  }

  return {
    alerts,
    loading,
    error,
    refreshAlerts: fetchAlerts,
    acknowledgeAlert,
    resolveAlert,
    updateAlertStatus,
  }
}

export function useAlertRules() {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true)
      const data = await alertsService.getAllRules()
      setRules(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch alert rules"))
      console.error("Error fetching alert rules:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  const createRule = async (ruleData: Partial<AlertRule>) => {
    try {
      await alertsService.createRule(ruleData)
      await fetchRules()
      return true
    } catch (err) {
      console.error("Error creating alert rule:", err)
      return false
    }
  }

  const updateRule = async (ruleId: string, ruleData: Partial<AlertRule>) => {
    try {
      await alertsService.updateRule(ruleId, ruleData)
      await fetchRules()
      return true
    } catch (err) {
      console.error(`Error updating alert rule ${ruleId}:`, err)
      return false
    }
  }

  const deleteRule = async (ruleId: string) => {
    try {
      await alertsService.deleteRule(ruleId)
      await fetchRules()
      return true
    } catch (err) {
      console.error(`Error deleting alert rule ${ruleId}:`, err)
      return false
    }
  }

  const toggleRuleStatus = async (ruleId: string, enable: boolean) => {
    try {
      if (enable) {
        await alertsService.enableRule(ruleId)
      } else {
        await alertsService.disableRule(ruleId)
      }
      await fetchRules()
      return true
    } catch (err) {
      console.error(`Error toggling alert rule ${ruleId} status:`, err)
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
    toggleRuleStatus,
  }
}

export function useAlertStats(startDate?: Date, endDate?: Date) {
  const [stats, setStats] = useState<AlertStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const data = await alertsService.getAlertStats(startDate, endDate)
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch alert statistics"))
      console.error("Error fetching alert statistics:", err)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  }
}
