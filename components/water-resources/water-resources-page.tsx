"use client"

import { useState } from "react"
import { WaterSourceList } from "@/components/water-resources/water-source-list"
import { WaterSourceDetails } from "@/components/water-resources/water-source-details"
import { WaterQualityData } from "@/components/water-resources/water-quality-data"
import { WaterLevelChart } from "@/components/water-resources/water-level-chart"
import { Button } from "@/components/ui/button"
import { Plus, Droplet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WaterSourceCreateModal } from "@/components/water-resources/water-source-create-modal"
import { WaterQualityModal } from "@/components/water-resources/water-quality-modal"
import { useWaterSources } from "@/hooks/use-water-sources"

export default function WaterResourcesPage() {
  const { data: waterSources, isLoading } = useWaterSources()
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [showCreateSourceModal, setShowCreateSourceModal] = useState(false)
  const [showAddQualityModal, setShowAddQualityModal] = useState(false)

  const selectedSource = waterSources?.find((source) => source.id === selectedSourceId) || null

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ressources en eau</h1>
          <p className="text-muted-foreground">Gestion des sources d'eau et de leur qualité</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddQualityModal(true)} disabled={!selectedSourceId}>
            <Droplet className="mr-2 h-4 w-4" />
            Ajouter mesure de qualité
          </Button>
          <Button onClick={() => setShowCreateSourceModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une source d'eau
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Sources d'eau</CardTitle>
              <CardDescription>Sélectionnez une source pour voir les détails</CardDescription>
            </CardHeader>
            <CardContent>
              <WaterSourceList
                onSelectSource={(sourceId) => setSelectedSourceId(sourceId)}
                selectedSourceId={selectedSourceId}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedSourceId ? (
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="quality">Qualité de l'eau</TabsTrigger>
                <TabsTrigger value="levels">Niveaux d'eau</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                {selectedSource && <WaterSourceDetails source={selectedSource} />}
              </TabsContent>

              <TabsContent value="quality">
                <WaterQualityData sourceId={selectedSourceId} onAddQuality={() => setShowAddQualityModal(true)} />
              </TabsContent>

              <TabsContent value="levels">
                <WaterLevelChart sourceId={selectedSourceId} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex h-40 flex-col items-center justify-center">
                <p className="text-muted-foreground">Sélectionnez une source d'eau pour voir les détails</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <WaterSourceCreateModal open={showCreateSourceModal} onClose={() => setShowCreateSourceModal(false)} />
      <WaterQualityModal
        open={showAddQualityModal}
        onClose={() => setShowAddQualityModal(false)}
        sourceId={selectedSourceId}
      />
    </div>
  )
}
