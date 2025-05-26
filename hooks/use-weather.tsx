"use client"

import { useState, useEffect } from "react"

export function useWeather(stationId?: string) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true)
        // In a real app, we would call the API with the stationId if provided
        // const endpoint = stationId
        //   ? `/weather/forecast/advanced?stationId=${stationId}`
        //   : "/weather/forecast/advanced";
        // const response = await apiService.get(endpoint);
        // setData(response);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setData({
          location: "Mediouna",
          temperature: 24,
          condition: "Ensoleillé",
          humidity: 45,
          windSpeed: 12,
          precipitation: 0,
          icon: "sun",
        })

        setError(null)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [stationId])

  return { data, isLoading, error }
}
