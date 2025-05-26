"use client"

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
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import type { Station } from "@/types/station"

interface FirmwareUpdateModalProps {
  station: Station
  open: boolean
  onClose: () => void
}

export function FirmwareUpdateModal({ station, open, onClose }: FirmwareUpdateModalProps) {
  const [status, setStatus] = useState<"idle" | "updating" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)

  const handleUpdate = async () => {
    try {
      setStatus("updating")

      // Simulate progress updates
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 500)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // In a real app, we would call the API
      // await apiService.post(`/stations/${station.id}/firmware`, {
      //   version: "2.4.0",
      //   forceUpdate: true
      // })

      clearInterval(interval)
      setProgress(100)
      setStatus("success")
    } catch (error) {
      setStatus("error")
      console.error("Firmware update failed:", error)
    }
  }

  const renderContent = () => {
    switch (status) {
      case "idle":
        return (
          <>
            <DialogDescription>
              Vous êtes sur le point de mettre à jour le firmware de la station <strong>{station.name}</strong> de la
              version <strong>{station.firmwareVersion}</strong> vers la version <strong>2.4.0</strong>.
            </DialogDescription>
            <div className="mt-4 rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-medium">Notes de version 2.4.0:</h4>
              <ul className="ml-4 list-disc text-sm text-muted-foreground">
                <li>Amélioration de la précision des capteurs de température</li>
                <li>Optimisation de la consommation d'énergie</li>
                <li>Correction de bugs dans la transmission des données</li>
                <li>Support pour les nouveaux capteurs d'humidité du sol</li>
              </ul>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleUpdate}>Mettre à jour</Button>
            </DialogFooter>
          </>
        )
      case "updating":
        return (
          <>
            <DialogDescription>
              Mise à jour du firmware en cours. Veuillez ne pas éteindre la station pendant cette opération.
            </DialogDescription>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-center text-sm text-muted-foreground">{progress}% terminé</p>
            </div>
          </>
        )
      case "success":
        return (
          <>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-center text-lg font-medium">Mise à jour réussie</h3>
              <p className="text-center text-sm text-muted-foreground">
                Le firmware de la station a été mis à jour avec succès vers la version 2.4.0.
              </p>
            </div>
            <DialogFooter className="mt-6">
              <Button onClick={onClose}>Fermer</Button>
            </DialogFooter>
          </>
        )
      case "error":
        return (
          <>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <h3 className="text-center text-lg font-medium">Échec de la mise à jour</h3>
              <p className="text-center text-sm text-muted-foreground">
                Une erreur s'est produite lors de la mise à jour du firmware. Veuillez réessayer ultérieurement.
              </p>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <Button onClick={handleUpdate}>Réessayer</Button>
            </DialogFooter>
          </>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mise à jour du firmware</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
