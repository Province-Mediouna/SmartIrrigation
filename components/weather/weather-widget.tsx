"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react"
import { useWeather } from "@/hooks/use-weather"
import { Skeleton } from "@/components/ui/skeleton"

interface WeatherWidgetProps {
  stationId?: string
}

export function WeatherWidget({ stationId }: WeatherWidgetProps) {
  const { data, isLoading, error } = useWeather(stationId)

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Météo</CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-24" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="text-right">
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Météo</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Impossible de charger les données météo. Veuillez réessayer.</p>
        </CardContent>
      </Card>
    )
  }

  // Fallback data for preview
  const weatherData = data || {
    location: "Mediouna",
    temperature: 24,
    condition: "Ensoleillé",
    humidity: 45,
    windSpeed: 12,
    precipitation: 0,
    icon: "sun",
  }

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="h-16 w-16 text-yellow-500" />
      case "cloud":
        return <Cloud className="h-16 w-16 text-gray-400" />
      case "rain":
        return <CloudRain className="h-16 w-16 text-blue-400" />
      default:
        return <Sun className="h-16 w-16 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Météo</CardTitle>
        <CardDescription>{weatherData.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {getWeatherIcon(weatherData.icon)}
          <div className="text-right">
            <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
            <p className="text-xs text-muted-foreground">{weatherData.condition}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Droplets className="h-3 w-3" />
            <span>Humidité: {weatherData.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-3 w-3" />
            <span>Vent: {weatherData.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-1">
            <CloudRain className="h-3 w-3" />
            <span>Précip.: {weatherData.precipitation} mm</span>
          </div>
          <div className="flex items-center gap-1">
            <Thermometer className="h-3 w-3" />
            <span>Ressenti: {weatherData.temperature - 1}°C</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
