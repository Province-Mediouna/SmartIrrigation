"use client"

import { useState, useEffect } from "react"
import { dronesService } from "@/services/drones-service"
import type { Drone } from "@/types/drone"

export function useDrones(options?: { page?: number; pageSize?: number }) {
  const [data, setData] = useState<Drone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await dronesService.getDrones({
          page: options?.page || 1,
          pageSize: options?.pageSize || 10,
        })

        setData(response.data)
        setTotalItems(response.total)
        setTotalPages(response.totalPages)
      } catch (err) {
        console.error("Failed to fetch drones:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch drones"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrones()
  }, [options?.page, options?.pageSize])

  return {
    data,
    isLoading,
    error,
    totalItems,
    totalPages,
  }
}
