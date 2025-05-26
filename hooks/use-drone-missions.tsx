"use client"

import { useState, useEffect } from "react"
import { dronesService } from "@/services/drones-service"
import type { DroneMission } from "@/types/drone"

export function useDroneMissions(droneId: string, options?: { page?: number; pageSize?: number }) {
  const [data, setData] = useState<DroneMission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchMissions = async () => {
      if (!droneId) {
        setData([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await dronesService.getMissions({
          page: options?.page || 1,
          pageSize: options?.pageSize || 10,
          filter: { droneId },
        })

        setData(response.data)
        setTotalItems(response.total)
        setTotalPages(response.totalPages)
      } catch (err) {
        console.error("Failed to fetch drone missions:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch drone missions"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchMissions()
  }, [droneId, options?.page, options?.pageSize])

  return {
    data,
    isLoading,
    error,
    totalItems,
    totalPages,
  }
}
