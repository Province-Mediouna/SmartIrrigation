"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useDroneMissions } from "@/hooks/use-drone-missions"
import { dronesService } from "@/services/drones-service"
import { useToast } from "@/hooks/use-toast"

interface DroneMissionListProps {
  droneId: string
  onSelectMission: (missionId: string) => void
  selectedMissionId: string | null
  onCreateMission: () => void
}

export function DroneMissionList({
  droneId,
  onSelectMission,
  selectedMissionId,
  onCreateMission,
}: DroneMissionListProps) {
  const { data: missions, isLoading, error } = useDroneMissions(droneId)
  const { toast } = useToast()
  const [startingMission, setStartingMission] = useState<string | null>(null)
  const [stoppingMission, setStoppingMission] = useState<string | null>(null)

  const handleStartMission = async (missionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setStartingMission(missionId)

    try {
      await dronesService.startMission(missionId)
      toast({
        title: "Mission démarrée",
        description: "La mission a été démarrée avec succès.",
      })
      // Idéalement, on devrait rafraîchir les données ici
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la mission.",
        variant: "destructive",
      })
    } finally {
      setStartingMission(null)
    }
  }

  const handleStopMission = async (missionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setStoppingMission(missionId)

    try {
      await dronesService.stopMission(missionId)
      toast({
        title: "Mission arrêtée",
        description: "La mission a été arrêtée avec succès.",
      })
      // Idéalement, on devrait rafraîchir les données ici
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'arrêter la mission.",
        variant: "destructive",
      })
    } finally {
      setStoppingMission(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return (
          <Badge variant="outline" className="border-blue-200 text-blue-800 dark:border-blue-800 dark:text-blue-300">
            Planifiée
          </Badge>
        )
      case "in_progress":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">En cours</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Terminée</Badge>
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="border-amber-200 text-amber-800 dark:border-amber-800 dark:text-amber-300"
          >
            Annulée
          </Badge>
        )
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Échouée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Missions</CardTitle>
          <Skeleton className="h-9 w-[100px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Missions</CardTitle>
          <Button onClick={onCreateMission}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle mission
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border border-destructive/50 p-8">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="mb-2 h-10 w-10 text-destructive" />
              <h3 className="text-lg font-semibold">Erreur de chargement</h3>
              <p className="text-sm text-muted-foreground">Impossible de charger les missions.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!missions || missions.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Missions</CardTitle>
          <Button onClick={onCreateMission}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle mission
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border p-8">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold">Aucune mission</h3>
              <p className="text-sm text-muted-foreground">Aucune mission n'a été planifiée pour ce drone.</p>
              <Button className="mt-4" onClick={onCreateMission}>
                Planifier une mission
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Missions</CardTitle>
        <Button onClick={onCreateMission}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle mission
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={cn(
                "cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted",
                selectedMissionId === mission.id && "border-primary bg-muted",
              )}
              onClick={() => onSelectMission(mission.id)}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{mission.name}</div>
                {getStatusBadge(mission.status)}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">
                  {mission.startTime ? (
                    <span>Démarré le {new Date(mission.startTime).toLocaleDateString()}</span>
                  ) : (
                    <span>Planifiée</span>
                  )}
                  {mission.purpose && <span> • {mission.purpose}</span>}
                </div>
                <div className="flex gap-2">
                  {mission.status === "planned" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => handleStartMission(mission.id, e)}
                      disabled={!!startingMission}
                    >
                      {startingMission === mission.id ? "Démarrage..." : "Démarrer"}
                    </Button>
                  )}
                  {mission.status === "in_progress" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => handleStopMission(mission.id, e)}
                      disabled={!!stoppingMission}
                    >
                      {stoppingMission === mission.id ? "Arrêt..." : "Arrêter"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
