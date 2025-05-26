"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Cloud, Droplets, Thermometer, Clock, AlertTriangle } from "lucide-react"

export function IrrigationSettings() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
          <CardDescription>Configuration globale du système d'irrigation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Cloud className="h-4 w-4 text-blue-500" />
                <Label htmlFor="weather-integration">Intégration météo</Label>
              </div>
              <Switch id="weather-integration" defaultChecked />
            </div>
            <p className="text-xs text-muted-foreground">
              Ajuste automatiquement l'irrigation en fonction des prévisions météorologiques.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <Label htmlFor="alerts">Alertes automatiques</Label>
              </div>
              <Switch id="alerts" defaultChecked />
            </div>
            <p className="text-xs text-muted-foreground">
              Envoie des alertes en cas de problèmes détectés dans le système d'irrigation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <Label htmlFor="night-irrigation">Irrigation nocturne</Label>
              </div>
              <Switch id="night-irrigation" defaultChecked />
            </div>
            <p className="text-xs text-muted-foreground">
              Privilégie l'irrigation pendant la nuit pour réduire l'évaporation.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="water-pressure">Pression d'eau cible</Label>
              <span className="text-sm font-medium">2.5 bar</span>
            </div>
            <Slider id="water-pressure" min={1} max={5} step={0.1} defaultValue={[2.5]} />
            <p className="text-xs text-muted-foreground">
              Définit la pression d'eau cible pour le système d'irrigation.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-duration">Durée d'irrigation par défaut</Label>
            <Select defaultValue="30">
              <SelectTrigger id="default-duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les paramètres
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seuils et déclencheurs</CardTitle>
          <CardDescription>Configuration des seuils de déclenchement de l'irrigation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="moisture">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="moisture" className="flex-1">
                <Droplets className="mr-2 h-4 w-4" />
                Humidité
              </TabsTrigger>
              <TabsTrigger value="temperature" className="flex-1">
                <Thermometer className="mr-2 h-4 w-4" />
                Température
              </TabsTrigger>
            </TabsList>

            <TabsContent value="moisture" className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="moisture-threshold">Seuil d'humidité minimal</Label>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <Slider id="moisture-threshold" min={0} max={100} step={5} defaultValue={[40]} />
                <p className="text-xs text-muted-foreground">
                  L'irrigation se déclenche lorsque l'humidité du sol descend sous ce seuil.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="moisture-target">Humidité cible</Label>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <Slider id="moisture-target" min={0} max={100} step={5} defaultValue={[70]} />
                <p className="text-xs text-muted-foreground">
                  L'irrigation s'arrête lorsque l'humidité du sol atteint ce niveau.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soil-type-default">Type de sol par défaut</Label>
                <Select defaultValue="LOAM">
                  <SelectTrigger id="soil-type-default">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLAY">Argileux</SelectItem>
                    <SelectItem value="SANDY">Sableux</SelectItem>
                    <SelectItem value="LOAM">Limoneux</SelectItem>
                    <SelectItem value="SILT">Silteux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="temperature" className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-temp-threshold">Température maximale</Label>
                  <span className="text-sm font-medium">35°C</span>
                </div>
                <Slider id="max-temp-threshold" min={20} max={50} step={1} defaultValue={[35]} />
                <p className="text-xs text-muted-foreground">
                  Déclenche une irrigation supplémentaire si la température dépasse ce seuil.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heat-response">Réponse à la chaleur</Label>
                <Select defaultValue="INCREASE_FREQUENCY">
                  <SelectTrigger id="heat-response">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCREASE_DURATION">Augmenter la durée</SelectItem>
                    <SelectItem value="INCREASE_FREQUENCY">Augmenter la fréquence</SelectItem>
                    <SelectItem value="BOTH">Les deux</SelectItem>
                    <SelectItem value="NONE">Aucune action</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cooling-period">Période de refroidissement</Label>
                <div className="flex items-center gap-2">
                  <Input id="cooling-period" type="number" defaultValue={30} className="w-20" />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Durée minimale entre deux irrigations déclenchées par la chaleur.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Button className="mt-6 w-full">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les seuils
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
