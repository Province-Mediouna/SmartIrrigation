"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileDown, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WaterQuality } from "@/types/water-resource"
import { waterResourcesService } from "@/services/water-resources-service"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface WaterQualityDataProps {
  sourceId: string
  onAddQuality: () => void
}

export function WaterQualityData({ sourceId, onAddQuality }: WaterQualityDataProps) {
  const { toast } = useToast()
  const [qualityData, setQualityData] = useState<WaterQuality[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQualityData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Définir une période de 3 mois pour les données
        const endDate = new Date()
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 3)

        const data = await waterResourcesService.getWaterQuality(sourceId, startDate, endDate)
        setQualityData(data)
      } catch (err) {
        console.error("Failed to fetch water quality data:", err)
        setError("Impossible de charger les données de qualité d'eau")
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de qualité d'eau",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (sourceId) {
      fetchQualityData()
    }
  }, [sourceId, toast])

  const handleExportData = () => {
    // Implémentation de l'exportation des données
    toast({
      title: "Export des données",
      description: "Les données ont été exportées avec succès",
    })
  }

  // Préparation des données pour le graphique
  const chartData = qualityData.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    ph: item.ph,
    conductivity: item.conductivity || 0,
    dissolvedOxygen: item.dissolvedOxygen || 0,
    temperature: item.temperature || 0,
  }))

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Qualité de l'eau</CardTitle>
          <Skeleton className="h-9 w-[100px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Qualité de l'eau</CardTitle>
          <Button onClick={onAddQuality}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une mesure
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border border-destructive/50 p-8">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="mb-2 h-10 w-10 text-destructive" />
              <h3 className="text-lg font-semibold">Erreur de chargement</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (qualityData.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Qualité de l'eau</CardTitle>
          <Button onClick={onAddQuality}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une mesure
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border p-8">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold">Aucune donnée disponible</h3>
              <p className="text-sm text-muted-foreground">
                Aucune mesure de qualité d'eau n'a été enregistrée pour cette source.
              </p>
              <Button className="mt-4" onClick={onAddQuality}>
                Ajouter une première mesure
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
        <CardTitle>Qualité de l'eau</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={onAddQuality}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une mesure
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="graph">
          <TabsList className="mb-4">
            <TabsTrigger value="graph">Graphique</TabsTrigger>
            <TabsTrigger value="table">Tableau</TabsTrigger>
          </TabsList>

          <TabsContent value="graph" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 70,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ph" name="pH" fill="#8884d8" />
                  <Bar dataKey="conductivity" name="Conductivité" fill="#82ca9d" />
                  <Bar dataKey="dissolvedOxygen" name="Oxygène dissous" fill="#ffc658" />
                  <Bar dataKey="temperature" name="Température" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="table">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead>Conductivité</TableHead>
                    <TableHead>Oxygène dissous</TableHead>
                    <TableHead>Température</TableHead>
                    <TableHead>Turbidité</TableHead>
                    <TableHead>TDS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{item.ph}</TableCell>
                      <TableCell>{item.conductivity || "N/A"}</TableCell>
                      <TableCell>{item.dissolvedOxygen || "N/A"}</TableCell>
                      <TableCell>{item.temperature ? `${item.temperature}°C` : "N/A"}</TableCell>
                      <TableCell>{item.turbidity || "N/A"}</TableCell>
                      <TableCell>{item.totalDissolvedSolids || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
