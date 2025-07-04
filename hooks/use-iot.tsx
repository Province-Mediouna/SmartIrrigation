"use client"

import { useState, useEffect, useCallback } from "react"
import { iotService } from "@/services/iot-service"
import type { IoTDevice, IoTDeviceFilter, IoTCommand, IoTDeviceStats } from "@/types/iot"

export function useIoTDevices(filter?: IoTDeviceFilter) {
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true)
      const response = await iotService.getAllDevices()
      setDevices(response)
      setTotalCount(response.length)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch IoT devices"))
      console.error("Error fetching IoT devices:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  const createDevice = async (device: Partial<IoTDevice>) => {
    try {
      await iotService.createDevice(device)
      await fetchDevices()
      return true
    } catch (err) {
      console.error("Error creating IoT device:", err)
      return false
    }
  }

  const updateDevice = async (deviceId: string, device: Partial<IoTDevice>) => {
    try {
      await iotService.updateDevice(deviceId, device)
      await fetchDevices()
      return true
    } catch (err) {
      console.error(`Error updating IoT device ${deviceId}:`, err)
      return false
    }
  }

  const deleteDevice = async (deviceId: string) => {
    try {
      await iotService.deleteDevice(deviceId)
      await fetchDevices()
      return true
    } catch (err) {
      console.error(`Error deleting IoT device ${deviceId}:`, err)
      return false
    }
  }

  const sendCommand = async (deviceId: string, command: IoTCommand) => {
    try {
      await iotService.sendCommand(deviceId, command)
      return true
    } catch (err) {
      console.error(`Error sending command to IoT device ${deviceId}:`, err)
      return false
    }
  }

  return {
    devices,
    loading,
    error,
    totalCount,
    refreshDevices: fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice,
    sendCommand,
  }
}

export function useIoTDeviceStats(deviceId: string, startDate?: Date, endDate?: Date) {
  const [stats, setStats] = useState<IoTDeviceStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    if (!deviceId) return

    try {
      setLoading(true)
      const data = await iotService.getDeviceStats(deviceId, startDate, endDate)
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch IoT device ${deviceId} statistics`))
      console.error(`Error fetching IoT device ${deviceId} statistics:`, err)
    } finally {
      setLoading(false)
    }
  }, [deviceId, startDate, endDate])

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
