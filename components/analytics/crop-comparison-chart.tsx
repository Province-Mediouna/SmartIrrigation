"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export function CropComparisonChart() {
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [view, setView] = useState<"radar" | "bar">("radar")

  useEffect(() => {
    const fetchCropComparisonData = async () => {
      try {
        setIsLoading(true)
        // In a real app, we would call the API
        // const response = await apiService.get("/analytics/crop-comparison");
        // setData(response);

        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockData = {
          radarData: [
            {
              crop: "Tomates",
              yield: 85,
              waterEfficiency: 70,
              profitability: 90,
              resilience: 65,
              laborIntensity: 80,
            },
            {
              crop: "Maïs",
              yield: 75,
              waterEfficiency: 60,
              profitability: 70,
              resilience: 80,
              laborIntensity: 50,
            },
            {
              crop: "Laitue",
              yield: 60,
              waterEfficiency: 85,
              profitability: 75,
              resilience: 55,
              laborIntensity: 70,
            },
            {
              crop: "Pommes de terre",
              yield: 90,
              waterEfficiency: 65,
              profitability: 85,
              resilience: 75,
              laborIntensity: 60,
            },
          ],
          barData: [
            { metric: "Rendement", Tomates: 85, Maïs: 75, Laitue: 60, "Pommes de terre": 90 },
            { metric: "Efficacité hydrique", Tomates: 70, Maïs: 60, Laitue: 85, "Pommes de terre": 65 },
            { metric: "Rentabilité", Tomates: 90, Maïs: 70, Laitue: 75, "Pommes de terre": 85 },
            { metric: "Résilience", Tomates: 65, Maïs: 80, Laitue: 55, "Pommes de terre": 75 },
            { metric: "Intensité de travail", Tomates: 80, Maïs: 50, Laitue: 70, "Pommes de terre": 60 },
          ],
        }

        setData(mockData)
        setError(null)
      } catch (err) {
        setError(err as Error)
        console.error("Failed to fetch crop comparison data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCropComparisonData()
  }, [])

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  if (error || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        Impossible de charger les données de comparaison des cultures. Veuillez réessayer.
      </p>
    )
  }

  return (
    <div>
      <Tabs value={view} onValueChange={(v) => setView(v as "radar" | "bar")} className="mb-4">
        <TabsList>
          <TabsTrigger value="radar">Vue radar</TabsTrigger>
          <TabsTrigger value="bar">Vue comparative</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-[400px] w-full">
        {view === "radar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarData[0]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              {data.radarData.map((entry: any, index: number) => {
                const colors = ["#3b82f6", "#22c55e", "#f97316", "#8b5cf6"]
                const dataKeys = ["yield", "waterEfficiency", "profitability", "resilience", "laborIntensity"]

                return (
                  <Radar
                    key={entry.crop}
                    name={entry.crop}
                    dataKey={(value) => {
                      const key = Object.keys(value).find((k) => dataKeys.includes(k))
                      return key ? value[key] : 0
                    }}
                    stroke={colors[index % colors.length]}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.3}
                  />
                )
              })}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="metric" type="category" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Tomates" fill="#3b82f6" />
              <Bar dataKey="Maïs" fill="#22c55e" />
              <Bar dataKey="Laitue" fill="#f97316" />
              <Bar dataKey="Pommes de terre" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
