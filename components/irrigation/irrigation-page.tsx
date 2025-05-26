"use client"

import { useState } from "react"
import { IrrigationZoneList } from "@/components/irrigation/irrigation-zone-list"
import { ScheduleOptimization } from "@/components/irrigation/schedule-optimization"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Settings, History } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IrrigationZoneModal } from "@/components/irrigation/irrigation-zone-modal"
import { IrrigationHistory } from "@/components/irrigation/irrigation-history"
import { IrrigationSettings } from "@/components/irrigation/irrigation-settings"

export default function IrrigationPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Irrigation</h1>
          <p className="text-muted-foreground">Gestion et optimisation de l'irrigation</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une zone
        </Button>
      </div>

      <Tabs defaultValue="zones">
        <TabsList className="mb-6">
          <TabsTrigger value="zones" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Zones
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Planification
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zones">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Zones d'irrigation</CardTitle>
                  <CardDescription>Gérez vos zones d'irrigation et leur état</CardDescription>
                </CardHeader>
                <CardContent>
                  <IrrigationZoneList />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                  <CardDescription>Aperçu de l'irrigation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Zones actives</div>
                      <div className="mt-1 text-2xl font-bold">1/3</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Consommation d'eau aujourd'hui</div>
                      <div className="mt-1 text-2xl font-bold">120 L</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Prochaine irrigation</div>
                      <div className="mt-1 text-2xl font-bold">14:30</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Économie d'eau</div>
                      <div className="mt-1 text-2xl font-bold text-green-500">18%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleOptimization />
        </TabsContent>

        <TabsContent value="history">
          <IrrigationHistory />
        </TabsContent>

        <TabsContent value="settings">
          <IrrigationSettings />
        </TabsContent>
      </Tabs>

      <IrrigationZoneModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  )
}
