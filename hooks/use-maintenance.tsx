"use client"

import { useState, useEffect, useCallback } from "react"
import { maintenanceService } from "@/services/maintenance-service"
import type { MaintenanceTask, MaintenanceTaskFilter, MaintenanceStats } from "@/types/maintenance"

export function useMaintenanceTasks(filter?: MaintenanceTaskFilter) {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const response = await maintenanceService.getTasks(filter)
      setTasks(response.data)
      setTotalCount(response.totalCount)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch maintenance tasks"))
      console.error("Error fetching maintenance tasks:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (task: Partial<MaintenanceTask>) => {
    try {
      await maintenanceService.createTask(task)
      await fetchTasks()
      return true
    } catch (err) {
      console.error("Error creating maintenance task:", err)
      return false
    }
  }

  const updateTask = async (taskId: string, task: Partial<MaintenanceTask>) => {
    try {
      await maintenanceService.updateTask(taskId, task)
      await fetchTasks()
      return true
    } catch (err) {
      console.error(`Error updating maintenance task ${taskId}:`, err)
      return false
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await maintenanceService.deleteTask(taskId)
      await fetchTasks()
      return true
    } catch (err) {
      console.error(`Error deleting maintenance task ${taskId}:`, err)
      return false
    }
  }

  const completeTask = async (taskId: string, notes?: string) => {
    try {
      await maintenanceService.completeTask(taskId, notes)
      await fetchTasks()
      return true
    } catch (err) {
      console.error(`Error completing maintenance task ${taskId}:`, err)
      return false
    }
  }

  const assignTask = async (taskId: string, userId: string) => {
    try {
      await maintenanceService.assignTask(taskId, userId)
      await fetchTasks()
      return true
    } catch (err) {
      console.error(`Error assigning maintenance task ${taskId}:`, err)
      return false
    }
  }

  return {
    tasks,
    loading,
    error,
    totalCount,
    refreshTasks: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    assignTask,
  }
}

export function useMaintenanceStats(startDate?: Date, endDate?: Date) {
  const [stats, setStats] = useState<MaintenanceStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const data = await maintenanceService.getStats(startDate, endDate)
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch maintenance statistics"))
      console.error("Error fetching maintenance statistics:", err)
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
