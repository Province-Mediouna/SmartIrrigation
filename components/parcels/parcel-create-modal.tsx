"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface ParcelCreateModalProps {
  open: boolean
  onClose: () => void
}

export function ParcelCreateModal({ open, onClose }: ParcelCreateModalProps) {
  const [name, setName] = useState("")
  const [area, setArea] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [soilType, setSoilType] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, we would call the API
      // await apiService.post("/parcels", {
      //   name,
      //   area: parseFloat(area),
      //   location: {
      //     latitude: parseFloat(latitude),
      //     longitude: parseFloat(longitude)
      //   },
      //   soilType,
      //   description
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onClose()
    } catch (error) {
      console.error("Failed to create parcel:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une parcelle</DialogTitle>
          <DialogDescription>Créez une nouvelle parcelle agricole dans le système.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la parcelle</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Parcelle Nord"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="area">Surface (hectares)</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                min="0.1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Ex: 5.2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Ex: 33.5731"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Ex: -7.5898"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="soil-type">Type de sol</Label>
              <Select value={soilType} onValueChange={setSoilType} required>
                <SelectTrigger id="soil-type">
                  <SelectValue placeholder="Sélectionnez un type de sol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLAY">Argileux</SelectItem>
                  <SelectItem value="SANDY">Sableux</SelectItem>
                  <SelectItem value="LOAM">Limoneux</SelectItem>
                  <SelectItem value="SILT">Silteux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la parcelle"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la parcelle"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
