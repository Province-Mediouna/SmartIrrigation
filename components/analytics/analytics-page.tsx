"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, BarChart, LineChart, PieChart, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { WaterUsageChart } from "@/components/analytics/water-usage-chart"
import { YieldPredictionChart } from "@/components/analytics/yield-prediction-chart"
import { SoilHealthChart } from "@/components/analytics/soil-health-chart"
import { WeatherPatternChart } from "@/components/analytics/weather-pattern-chart"
import { CropComparisonChart } from "@/components/analytics/crop-comparison-chart"
import { EfficiencyMetrics } from "@/components/analytics/efficiency-metrics"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  })
  const [parcelFilter, setParcelFilter] = useState("all")
  const [cropFilter, setCropFilter] = useState("all")

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Analyses et prédictions pour optimiser votre exploitation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Période:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 justify-start px-3 text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "P", { locale: fr })} - {format(dateRange.to, "P", { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, "P", { locale: fr })
                  )
                ) : (
                  "Sélectionner une période"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Parcelle:</span>
          <Select value={parcelFilter} onValueChange={setParcelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les parcelles</SelectItem>
              <SelectItem value="1">Parcelle Nord</SelectItem>
              <SelectItem value="2">Parcelle Sud</SelectItem>
              <SelectItem value="3">Parcelle Est</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Culture:</span>
          <Select value={cropFilter} onValueChange={setCropFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les cultures</SelectItem>
              <SelectItem value="tomatoes">Tomates</SelectItem>
              <SelectItem value="corn">Maïs</SelectItem>
              <SelectItem value="lettuce">Laitue</SelectItem>
              <SelectItem value="potatoes">Pommes de terre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="water">
        <TabsList className="mb-6">
          <TabsTrigger value="water" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Consommation d'eau
          </TabsTrigger>
          <TabsTrigger value="yield" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Prédictions de rendement
          </TabsTrigger>
          <TabsTrigger value="soil" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Santé du sol
          </TabsTrigger>
          <TabsTrigger value="weather" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Motifs climatiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="water">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WaterUsageChart dateRange={dateRange} parcelId={parcelFilter !== "all" ? parcelFilter : undefined} />
            </div>
            <div>
              <EfficiencyMetrics
                title="Métriques d'efficacité hydrique"
                metrics={[
                  { name: "Consommation totale", value: "1,250 m³", change: -5.2 },
                  { name: "Efficacité moyenne", value: "82%", change: 3.1 },
                  { name: "Économie d'eau", value: "210 m³", change: 15.8 },
                  { name: "Coût par hectare", value: "125 MAD", change: -8.5 },
                ]}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="yield">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <YieldPredictionChart cropType={cropFilter !== "all" ? cropFilter : undefined} />
            </div>
            <div>
              <EfficiencyMetrics
                title="Prévisions de rendement"
                metrics={[
                  { name: "Rendement prévu", value: "8.5 t/ha", change: 12.3 },
                  { name: "Précision du modèle", value: "89%", change: 4.2 },
                  { name: "Revenu estimé", value: "45,000 MAD", change: 15.7 },
                  { name: "Risque", value: "Faible", change: -25.0 },
                ]}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="soil">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SoilHealthChart parcelId={parcelFilter !== "all" ? parcelFilter : undefined} />
            </div>
            <div>
              <EfficiencyMetrics
                title="Indicateurs de santé du sol"
                metrics={[
                  { name: "Indice de fertilité", value: "78/100", change: 5.6 },
                  { name: "Matière organique", value: "3.2%", change: 8.3 },
                  { name: "Activité biologique", value: "Élevée", change: 12.0 },
                  { name: "Compaction", value: "Faible", change: -15.0 },
                ]}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="weather">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WeatherPatternChart dateRange={dateRange} />
            </div>
            <div>
              <EfficiencyMetrics
                title="Analyse climatique"
                metrics={[
                  { name: "Précipitations", value: "45 mm", change: -12.5 },
                  { name: "Température moy.", value: "24.5°C", change: 2.3 },
                  { name: "Jours de chaleur", value: "12", change: 33.3 },
                  { name: "Évapotranspiration", value: "5.2 mm/j", change: 8.7 },
                ]}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Comparaison des cultures</CardTitle>
            <CardDescription>Performance relative des différentes cultures</CardDescription>
          </CardHeader>
          <CardContent>
            <CropComparisonChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
