"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Droplets, Thermometer, FlaskRoundIcon as Flask, Leaf, BarChart, RefreshCw } from "lucide-react"
import type { SoilDataType } from "@/types/soil"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface SoilDataProps {
  parcelId: string
}

export function SoilData({ parcelId }: SoilDataProps) {
  const [data, setData] = useState<SoilDataType | null>(null)
  const [historicalData, setHistoricalData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        setIsLoading(true)
        // In a real app, we would call the API
        // const response = await apiService.get(`/environment/soil?parcelId=${parcelId}`);
        // setData(response);

        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockData: SoilDataType = {
          moisture: 65,
          temperature: 22.5,
          ph: 6.8,
          nutrients: {
            nitrogen: 42,
            phosphorus: 35,
            potassium: 58,
            calcium: 70,
            magnesium: 65,
          },
          organicMatter: 3.2,
          texture: {
            sand: 40,
            silt: 40,
            clay: 20,
          },
          lastUpdated: new Date().toISOString(),
        }

        // Generate historical data for the last 30 days
        const mockHistoricalData = []
        const now = new Date()
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)

          mockHistoricalData.push({
            date: date.toISOString().split("T")[0],
            moisture: Math.round(65 + Math.sin(i / 5) * 15 + (Math.random() - 0.5) * 5),
            temperature: Math.round((22.5 + Math.sin(i / 7) * 3 + (Math.random() - 0.5) * 1) * 10) / 10,
            ph: Math.round((6.8 + Math.sin(i / 10) * 0.3 + (Math.random() - 0.5) * 0.1) * 10) / 10,
          })
        }

        setData(mockData)
        setHistoricalData(mockHistoricalData)
        setError(null)
      } catch (err) {
        setError(err as Error)
        console.error("Failed to fetch soil data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (parcelId) {
      fetchSoilData()
    }
  }, [parcelId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getNutrientLevel = (value: number) => {
    if (value < 30) return "Faible"
    if (value < 60) return "Moyen"
    return "Élevé"
  }

  const getNutrientColor = (value: number) => {
    if (value < 30) return "text-red-500"
    if (value < 60) return "text-yellow-500"
    return "text-green-500"
  }

  const getPhStatus = (ph: number) => {
    if (ph < 5.5) return "Acide"
    if (ph < 7.3) return "Neutre"
    return "Alcalin"
  }

  const getPhColor = (ph: number) => {
    if (ph < 5.5) return "text-red-500"
    if (ph < 7.3) return "text-green-500"
    return "text-blue-500"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Données du sol</CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-40" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Données du sol</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Impossible de charger les données du sol. Veuillez réessayer.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Données du sol</CardTitle>
            <CardDescription>Dernière mise à jour: {formatDate(data.lastUpdated)}</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">État actuel</TabsTrigger>
            <TabsTrigger value="historical">Historique</TabsTrigger>
            <TabsTrigger value="texture">Texture</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Humidité du sol
                </div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Niveau</span>
                  <span className="font-medium">{data.moisture}%</span>
                </div>
                <Progress value={data.moisture} className="h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {data.moisture < 30
                    ? "Niveau d'humidité faible, irrigation recommandée."
                    : data.moisture > 80
                      ? "Niveau d'humidité élevé, risque d'engorgement."
                      : "Niveau d'humidité optimal pour la plupart des cultures."}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  Température du sol
                </div>
                <div className="text-2xl font-bold">{data.temperature}°C</div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {data.temperature < 10
                    ? "Température basse, croissance ralentie."
                    : data.temperature > 30
                      ? "Température élevée, stress possible pour les plantes."
                      : "Température optimale pour l'activité biologique du sol."}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Flask className="h-4 w-4 text-purple-500" />
                  pH du sol
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{data.ph}</div>
                  <Badge variant="outline" className={getPhColor(data.ph)}>
                    {getPhStatus(data.ph)}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {data.ph < 5.5
                    ? "Sol acide, certains nutriments peuvent être moins disponibles."
                    : data.ph > 7.3
                      ? "Sol alcalin, peut limiter l'absorption de certains nutriments."
                      : "pH optimal pour la plupart des cultures."}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-4 text-sm font-medium">Nutriments</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {Object.entries(data.nutrients).map(([nutrient, value]) => (
                  <div key={nutrient} className="rounded-lg border p-3 text-center">
                    <div className="text-xs text-muted-foreground capitalize">{nutrient}</div>
                    <div className={`text-lg font-bold ${getNutrientColor(value)}`}>{value}%</div>
                    <div className="text-xs">{getNutrientLevel(value)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Leaf className="h-4 w-4 text-green-500" />
                Matière organique
              </div>
              <div className="mt-2 text-lg font-bold">{data.organicMatter}%</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {data.organicMatter < 2
                  ? "Niveau faible, amendement organique recommandé."
                  : data.organicMatter > 5
                    ? "Excellent niveau de matière organique, sol très fertile."
                    : "Bon niveau de matière organique, sol fertile."}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="historical">
            {historicalData && (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 14]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="moisture"
                      name="Humidité (%)"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      name="Température (°C)"
                      stroke="#ef4444"
                    />
                    <Line yAxisId="right" type="monotone" dataKey="ph" name="pH" stroke="#8b5cf6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="texture">
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {Object.entries(data.texture).map(([type, percentage]) => (
                <div key={type} className="rounded-lg border p-4">
                  <div className="mb-2 text-sm font-medium capitalize">{type}</div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Pourcentage</span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))}
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <BarChart className="h-4 w-4" />
                Classification du sol
              </div>
              <p className="text-sm">
                Basé sur la composition du sol (
                {Object.entries(data.texture)
                  .map(([type, percentage]) => `${type}: ${percentage}%`)
                  .join(", ")}
                ), ce sol est classifié comme{" "}
                <span className="font-medium">
                  {data.texture.clay > 40
                    ? "Argileux"
                    : data.texture.sand > 60
                      ? "Sableux"
                      : data.texture.silt > 60
                        ? "Limoneux"
                        : "Équilibré (Loam)"}
                </span>
                .
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {data.texture.clay > 40
                  ? "Les sols argileux retiennent bien l'eau et les nutriments mais peuvent être mal drainés."
                  : data.texture.sand > 60
                    ? "Les sols sableux sont bien drainés mais retiennent moins l'eau et les nutriments."
                    : data.texture.silt > 60
                      ? "Les sols limoneux ont une bonne rétention d'eau mais peuvent être sujets à la compaction."
                      : "Les sols équilibrés (loam) offrent un bon compromis entre rétention d'eau et drainage."}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
