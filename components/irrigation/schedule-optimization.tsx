"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, BarChart, Cloud, Droplets, Thermometer } from "lucide-react"

export function ScheduleOptimization() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [waterSaving, setWaterSaving] = useState(50)
  const [useWeatherForecast, setUseWeatherForecast] = useState(true)
  const [useSoilMoisture, setUseSoilMoisture] = useState(true)
  const [useCropType, setUseCropType] = useState(true)

  const handleOptimize = async () => {
    setIsOptimizing(true)

    try {
      // In a real app, we would call the API
      // await apiService.post("/irrigation/schedules/optimization", {
      //   startDate: date,
      //   endDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
      //   constraints: {
      //     waterSavingTarget: waterSaving,
      //     useWeatherForecast,
      //     useSoilMoisture,
      //     useCropType
      //   }
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error("Optimization failed:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Planification optimisée</CardTitle>
            <CardDescription>Optimisez votre planning d'irrigation pour économiser l'eau</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly">
              <TabsList className="mb-4">
                <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly">
                <div className="rounded-lg border p-4">
                  <div className="mb-4 grid grid-cols-7 gap-2 text-center text-xs font-medium">
                    <div>Lun</div>
                    <div>Mar</div>
                    <div>Mer</div>
                    <div>Jeu</div>
                    <div>Ven</div>
                    <div>Sam</div>
                    <div>Dim</div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="rounded-lg border p-2">
                        <div className="mb-1 text-xs font-medium">Zone Nord</div>
                        <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Droplets className="h-3 w-3" />
                          <span>06:00 - 06:30</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Droplets className="h-3 w-3" />
                          <span>18:00 - 18:15</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="monthly">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Réinitialiser</Button>
            <Button onClick={handleOptimize} disabled={isOptimizing}>
              {isOptimizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimisation...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Appliquer le planning
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Paramètres d'optimisation</CardTitle>
            <CardDescription>Ajustez les paramètres pour l'optimisation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="water-saving">Économie d'eau cible</Label>
                <span className="text-sm font-medium">{waterSaving}%</span>
              </div>
              <Slider
                id="water-saving"
                min={0}
                max={100}
                step={5}
                value={[waterSaving]}
                onValueChange={(value) => setWaterSaving(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Définissez votre objectif d'économie d'eau par rapport à un arrosage standard.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Facteurs à considérer</h3>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="weather-forecast">Prévisions météo</Label>
                </div>
                <Switch id="weather-forecast" checked={useWeatherForecast} onCheckedChange={setUseWeatherForecast} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-green-500" />
                  <Label htmlFor="soil-moisture">Humidité du sol</Label>
                </div>
                <Switch id="soil-moisture" checked={useSoilMoisture} onCheckedChange={setUseSoilMoisture} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <Label htmlFor="crop-type">Type de culture</Label>
                </div>
                <Switch id="crop-type" checked={useCropType} onCheckedChange={setUseCropType} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Économies estimées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Eau économisée</div>
                <div className="mt-1 text-2xl font-bold text-green-500">450 L/semaine</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Coût économisé</div>
                <div className="mt-1 text-2xl font-bold text-green-500">45 MAD/semaine</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
