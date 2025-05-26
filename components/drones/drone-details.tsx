"use client"

import type React from "react"

import { useState } from "react"
import type { Drone } from "@/types/drone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Battery, Clock, Wrench, Plane } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { dronesService } from "@/services/drones-service"
import { Progress } from "@/components/ui/progress"

interface DroneDetailsProps {
  drone: Drone
}

export function DroneDetails({ drone }: DroneDetailsProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<Partial<Drone>>({
    name: drone.name,
    model: drone.model,
    status: drone.status,
    maxFlightTime: drone.maxFlightTime,
    range: drone.range,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dronesService.updateDrone(drone.id, formData)
      toast({
        title: "Drone mis à jour",
        description: "Les informations ont été mises à jour avec succès.",
      })
      setIsEditing(false)
      // Idéalement, on devrait rafraîchir les données ici
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le drone.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await dronesService.deleteDrone(drone.id)
      toast({
        title: "Drone supprimé",
        description: "Le drone a été supprimé avec succès.",
      })
      setIsDeleting(false)
      // Idéalement, on devrait rediriger l'utilisateur ici
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le drone.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Disponible</Badge>
      case "in_mission":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">En mission</Badge>
      case "charging":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">En charge</Badge>
      case "maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Maintenance</Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="border-gray-200 text-gray-800 dark:border-gray-800 dark:text-gray-300">
            Hors ligne
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 70) return "bg-green-500"
    if (level > 30) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détails du drone</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-destructive" onClick={() => setIsDeleting(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nom</h3>
                <p className="text-lg font-medium">{drone.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Modèle</h3>
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-blue-500" />
                  <p>{drone.model}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Statut</h3>
                <div>{getStatusBadge(drone.status)}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Numéro de série</h3>
                <p>{drone.serialNumber}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Charge de batterie</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4" />
                      <span>{drone.batteryLevel}%</span>
                    </div>
                  </div>
                  <Progress value={drone.batteryLevel} className={getBatteryColor(drone.batteryLevel)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Temps de vol maximum</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p>{drone.maxFlightTime} minutes</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Portée</h3>
                <p>{drone.range} mètres</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Heures de vol</h3>
                <p>{drone.flightHours} heures</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Dernière maintenance</h3>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-gray-500" />
                  <p>{new Date(drone.lastMaintenance).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Prochaine maintenance</h3>
                <p>{new Date(drone.nextMaintenance).toLocaleDateString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Capteurs</h3>
                <div className="flex flex-wrap gap-1">
                  {drone.payload.map((sensor, index) => (
                    <Badge key={index} variant="outline">
                      {sensor}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le drone</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="model">Modèle</Label>
                <Input id="model" name="model" value={formData.model || ""} onChange={handleInputChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="in_mission">En mission</SelectItem>
                    <SelectItem value="charging">En charge</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Hors ligne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxFlightTime">Temps de vol maximum (minutes)</Label>
                <Input
                  id="maxFlightTime"
                  name="maxFlightTime"
                  type="number"
                  value={formData.maxFlightTime || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="range">Portée (mètres)</Label>
                <Input
                  id="range"
                  name="range"
                  type="number"
                  value={formData.range || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de suppression */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer le drone</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer ce drone ? Cette action est irréversible.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
