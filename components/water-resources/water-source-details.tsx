"use client"

import type React from "react"

import { useState } from "react"
import type { WaterSource } from "@/types/water-resource"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Droplet, MapPin, Calendar, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { waterResourcesService } from "@/services/water-resources-service"

interface WaterSourceDetailsProps {
  source: WaterSource
}

export function WaterSourceDetails({ source }: WaterSourceDetailsProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<Partial<WaterSource>>({
    name: source.name,
    type: source.type,
    status: source.status,
    description: source.description,
    capacity: source.capacity,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await waterResourcesService.updateWaterSource(source.id, formData)
      toast({
        title: "Source d'eau mise à jour",
        description: "Les informations ont été mises à jour avec succès.",
      })
      setIsEditing(false)
      // Idéalement, on devrait rafraîchir les données ici
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la source d'eau.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await waterResourcesService.deleteWaterSource(source.id)
      toast({
        title: "Source d'eau supprimée",
        description: "La source d'eau a été supprimée avec succès.",
      })
      setIsDeleting(false)
      // Idéalement, on devrait rediriger l'utilisateur ici
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la source d'eau.",
        variant: "destructive",
      })
    }
  }

  const getSourceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      well: "Puits",
      reservoir: "Réservoir",
      river: "Rivière",
      rain: "Eau de pluie",
      municipal: "Réseau municipal",
      other: "Autre",
    }
    return typeMap[type] || type
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="border-gray-200 text-gray-800 dark:border-gray-800 dark:text-gray-300">
            Inactive
          </Badge>
        )
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="border-amber-200 text-amber-800 dark:border-amber-800 dark:text-amber-300"
          >
            Maintenance
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détails de la source d'eau</CardTitle>
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nom</h3>
                <p className="text-lg font-medium">{source.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <p>{getSourceTypeLabel(source.type)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Statut</h3>
                <div>{getStatusBadge(source.status)}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Capacité</h3>
                <p>{source.capacity ? `${source.capacity} m³` : "Non spécifiée"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Localisation</h3>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <p>
                    {source.location.latitude.toFixed(4)}, {source.location.longitude.toFixed(4)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Niveau actuel</h3>
                <p>{source.currentLevel !== undefined ? `${source.currentLevel}%` : "Non disponible"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Dernière mise à jour</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p>{new Date(source.lastUpdate).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-sm">{source.description || "Aucune description"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la source d'eau</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="well">Puits</SelectItem>
                    <SelectItem value="reservoir">Réservoir</SelectItem>
                    <SelectItem value="river">Rivière</SelectItem>
                    <SelectItem value="rain">Eau de pluie</SelectItem>
                    <SelectItem value="municipal">Réseau municipal</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacité (m³)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={3}
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
            <DialogTitle>Supprimer la source d'eau</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Êtes-vous sûr de vouloir supprimer cette source d'eau ? Cette action est irréversible.
              </p>
            </div>
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
