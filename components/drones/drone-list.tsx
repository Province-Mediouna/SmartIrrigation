"use client"

import { useDrones } from "@/hooks/use-drones"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DrillIcon as Drone, Battery, Clock } from "lucide-react"

interface DroneListProps {
  onSelectDrone: (droneId: string) => void
  selectedDroneId: string | null
}

export function DroneList({ onSelectDrone, selectedDroneId }: DroneListProps) {
  const { data: drones, isLoading, error } = useDrones()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 p-4">
        <p className="text-sm text-destructive">Impossible de charger les drones. Veuillez réessayer.</p>
      </div>
    )
  }

  if (!drones || drones.length === 0) {
    return (
      <div className="rounded-md border p-4">
        <p className="text-sm text-muted-foreground">Aucun drone trouvé. Ajoutez votre premier drone.</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Disponible</Badge>
      case "in_mission":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">En mission</Badge>
      case "charging":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">En charge</Badge>
      case "maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Maintenance</Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="border-gray-200 text-gray-800 dark:border-gray-800 dark:text-gray-300">
            Hors ligne
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 70) return "text-green-500"
    if (level > 30) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-3">
      {drones.map((drone) => (
        <div
          key={drone.id}
          className={cn(
            "cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted",
            selectedDroneId === drone.id && "border-primary bg-muted",
          )}
          onClick={() => onSelectDrone(drone.id)}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{drone.name}</div>
            {getStatusBadge(drone.status)}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Drone className="h-3 w-3" />
              <span>{drone.model}</span>
            </div>
            <div className="flex items-center gap-1">
              <Battery className={cn("h-3 w-3", getBatteryColor(drone.batteryLevel))} />
              <span>{drone.batteryLevel}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{drone.maxFlightTime} min</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
