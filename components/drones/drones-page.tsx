"use client"

import { useState } from "react"
import { DroneList } from "@/components/drones/drone-list"
import { DroneDetails } from "@/components/drones/drone-details"
import { DroneMissionList } from "@/components/drones/drone-mission-list"
import { DroneImageGallery } from "@/components/drones/drone-image-gallery"
import { Button } from "@/components/ui/button"
import { Plus, Send } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DroneCreateModal } from "@/components/drones/drone-create-modal"
import { DroneMissionCreateModal } from "@/components/drones/drone-mission-create-modal"
import { useDrones } from "@/hooks/use-drones"

export default function DronesPage() {
  const { data: drones, isLoading } = useDrones()
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null)
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)
  const [showCreateDroneModal, setShowCreateDroneModal] = useState(false)
  const [showCreateMissionModal, setShowCreateMissionModal] = useState(false)

  const selectedDrone = drones?.find((drone) => drone.id === selectedDroneId) || null

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des drones</h1>
          <p className="text-muted-foreground">Surveillance aérienne et collecte de données</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCreateMissionModal(true)} disabled={!selectedDroneId}>
            <Send className="mr-2 h-4 w-4" />
            Planifier une mission
          </Button>
          <Button onClick={() => setShowCreateDroneModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un drone
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Drones</CardTitle>
              <CardDescription>Sélectionnez un drone pour voir les détails</CardDescription>
            </CardHeader>
            <CardContent>
              <DroneList
                onSelectDrone={(droneId) => {
                  setSelectedDroneId(droneId)
                  setSelectedMissionId(null)
                }}
                selectedDroneId={selectedDroneId}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedDroneId ? (
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="missions">Missions</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="details">{selectedDrone && <DroneDetails drone={selectedDrone} />}</TabsContent>

              <TabsContent value="missions">
                <DroneMissionList
                  droneId={selectedDroneId}
                  onSelectMission={setSelectedMissionId}
                  selectedMissionId={selectedMissionId}
                  onCreateMission={() => setShowCreateMissionModal(true)}
                />
              </TabsContent>

              <TabsContent value="images">
                <DroneImageGallery missionId={selectedMissionId} droneId={selectedDroneId} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex h-40 flex-col items-center justify-center">
                <p className="text-muted-foreground">Sélectionnez un drone pour voir les détails</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DroneCreateModal open={showCreateDroneModal} onClose={() => setShowCreateDroneModal(false)} />
      <DroneMissionCreateModal
        open={showCreateMissionModal}
        onClose={() => setShowCreateMissionModal(false)}
        droneId={selectedDroneId}
      />
    </div>
  )
}
