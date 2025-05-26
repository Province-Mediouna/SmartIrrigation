"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { waterResourcesService } from "@/services/water-resources-service"

interface WaterQualityModalProps {
  open: boolean
  onClose: () => void
  sourceId: string | null
}

export function WaterQualityModal({ open, onClose, sourceId }: WaterQualityModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    ph: "7.0",
    conductivity: "",
    dissolvedOxygen: "",
    temperature: "",
    turbidity: "",
    totalDissolvedSolids: "",
    nitrateLevel: "",
    phosphateLevel: "",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sourceId) {
      toast({
        title: "Erreur",
        description: "Aucune source d'eau sélectionnée.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Conversion des valeurs numériques
      const dataToSubmit = {
        ph: Number.parseFloat(formData.ph),
        conductivity: formData.conductivity ? Number.parseFloat(formData.conductivity) : undefined,
        dissolvedOxygen: formData.dissolvedOxygen ? Number.parseFloat(formData.dissolvedOxygen) : undefined,
        temperature: formData.temperature ? Number.parseFloat(formData.temperature) : undefined,
        turbidity: formData.turbidity ? Number.parseFloat(formData.turbidity) : undefined,
        totalDissolvedSolids: formData.totalDissolvedSolids
          ? Number.parseFloat(formData.totalDissolvedSolids)
          : undefined,
        nitrateLevel: formData.nitrateLevel ? Number.parseFloat(formData.nitrateLevel) : undefined,
        phosphateLevel: formData.phosphateLevel ? Number.parseFloat(formData.phosphateLevel) : undefined,
        notes: formData.notes || undefined,
      }

      await waterResourcesService.addWaterQualityMeasurement(sourceId, dataToSubmit)
      toast({
        title: "Mesure ajoutée",
        description: "La mesure de qualité d'eau a été ajoutée avec succès.",
      })
      onClose()
      // Idéalement, on devrait rafraîchir les données ici
    } catch (error) {
      console.error("Failed to add water quality measurement:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la mesure de qualité d'eau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une mesure de qualité d'eau</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ph">pH (obligatoire)</Label>
              <Input
                id="ph"
                name="ph"
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={formData.ph}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="conductivity">Conductivité (µS/cm)</Label>
                <Input
                  id="conductivity"
                  name="conductivity"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.conductivity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dissolvedOxygen">Oxygène dissous (mg/L)</Label>
                <Input
                  id="dissolvedOxygen"
                  name="dissolvedOxygen"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dissolvedOxygen}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="temperature">Température (°C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="turbidity">Turbidité (NTU)</Label>
                <Input
                  id="turbidity"
                  name="turbidity"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.turbidity}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalDissolvedSolids">TDS (mg/L)</Label>
                <Input
                  id="totalDissolvedSolids"
                  name="totalDissolvedSolids"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.totalDissolvedSolids}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nitrateLevel">Nitrates (mg/L)</Label>
                <Input
                  id="nitrateLevel"
                  name="nitrateLevel"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.nitrateLevel}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phosphateLevel">Phosphates (mg/L)</Label>
                <Input
                  id="phosphateLevel"
                  name="phosphateLevel"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.phosphateLevel}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
