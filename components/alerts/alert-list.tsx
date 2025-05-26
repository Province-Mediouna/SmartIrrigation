"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAlerts } from "@/hooks/use-alerts"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Droplets, Thermometer, Battery, Wifi } from "lucide-react"

export function AlertList() {
  const { data, isLoading, error } = useAlerts()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Alertes
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-24" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Alertes
          </CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Impossible de charger les alertes. Veuillez réessayer.</p>
        </CardContent>
      </Card>
    )
  }

  // Fallback data for preview
  const alerts = data || [
    {
      id: "1",
      type: "water_level",
      severity: "high",
      message: "Niveau d'eau critique dans la zone 3",
      timestamp: "2023-05-14T10:15:00Z",
    },
    {
      id: "2",
      type: "battery",
      severity: "medium",
      message: "Batterie faible - Station Sud",
      timestamp: "2023-05-14T09:30:00Z",
    },
    {
      id: "3",
      type: "connectivity",
      severity: "medium",
      message: "Perte de connexion - Station Est",
      timestamp: "2023-05-14T08:45:00Z",
    },
    {
      id: "4",
      type: "temperature",
      severity: "low",
      message: "Température élevée - Serre 2",
      timestamp: "2023-05-14T07:20:00Z",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "water_level":
        return <Droplets className="h-4 w-4" />
      case "battery":
        return <Battery className="h-4 w-4" />
      case "connectivity":
        return <Wifi className="h-4 w-4" />
      case "temperature":
        return <Thermometer className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">Critique</Badge>
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
            Moyenne
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Faible
          </Badge>
        )
      default:
        return null
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Alertes
        </CardTitle>
        <CardDescription>{alerts.length} alertes actives</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <div className="font-medium">{alert.message}</div>
                  <div className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</div>
                </div>
              </div>
              <div>{getSeverityBadge(alert.severity)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
