"use client"

import { useState, useEffect } from "react"
import { waterResourcesService } from "@/services/water-resources-service"
import type { WaterSource } from "@/types/water-resource"

export function useWaterSources(options?: { page?: number; pageSize?: number }) {
  const [data, setData] = useState<WaterSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchWaterSources = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await waterResourcesService.getWaterSources({
          page: options?.page || 1,
          pageSize: options?.pageSize || 10,
        })

        setData(response.data)
        setTotalItems(response.total)
        setTotalPages(response.totalPages)
      } catch (err) {
        console.error("Failed to fetch water sources:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch water sources"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchWaterSources()
  }, [options?.page, options?.pageSize])

  return {
    data,
    isLoading,
    error,
    totalItems,
    totalPages,
  }
}
