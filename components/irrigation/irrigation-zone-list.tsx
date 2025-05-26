"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useIrrigationZones } from "@/hooks/use-irrigation-zones"
import { Skeleton } from "@/components/ui/skeleton"
import { Droplets, Play, Pause, Plus, Ruler, Layers } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function IrrigationZoneList() {
  const { data, isLoading, error } = useIrrigationZones()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Zones d'irrigation</CardTitle>
              <CardDescription>État et contrôle</CardDescription>
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
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
          <CardTitle>Zones d'irrigation</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger les zones d'irrigation. Veuillez réessayer.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Fallback data for preview
  const zones = data || [
    {
      id: "1",
      name: "Zone Nord - Tomates",
      status: "active",
      moisture: 65,
      nextSchedule: "2023-05-14T14:30:00Z",
      area: 0.5,
      irrigationSystem: "DRIP",
    },
    {
      id: "2",
      name: "Zone Sud - Concombres",
      status: "inactive",
      moisture: 78,
      nextSchedule: "2023-05-14T16:00:00Z",
    },
    {
      id: "3",
      name: "Zone Est - Laitues",
      status: "inactive",
      moisture: 42,
      nextSchedule: "2023-05-14T12:15:00Z",
      area: 0.8,
      irrigationSystem: "SURFACE",
    },
  ]

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return null
    }
  }

  const getMoistureColor = (moisture: number) => {
    if (moisture < 40) return "text-destructive"
    if (moisture < 60) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Zones d'irrigation</CardTitle>
            <CardDescription>État et contrôle</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {zones.map((zone) => (
            <div key={zone.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className={`h-4 w-4 ${getMoistureColor(zone.moisture)}`} />
                  <span className="font-medium">{zone.name}</span>
                </div>
                <div>{getStatusBadge(zone.status)}</div>
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  <span>{zone.area} m²</span>
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>{zone.irrigationSystem}</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>Humidité du sol</span>
                  <span className={getMoistureColor(zone.moisture)}>{zone.moisture}%</span>
                </div>
                <Progress value={zone.moisture} className="h-2" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Prochaine irrigation: {formatTime(zone.nextSchedule)}
                </div>
                <Button
                  variant={zone.status === "active" ? "destructive" : "default"}
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs"
                >
                  {zone.status === "active" ? (
                    <>
                      <Pause className="h-3 w-3" /> Arrêter
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" /> Démarrer
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
