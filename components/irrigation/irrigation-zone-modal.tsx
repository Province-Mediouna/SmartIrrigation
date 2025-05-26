"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useParcels } from "@/hooks/use-parcels";

interface IrrigationZoneModalProps {
  open: boolean;
  onClose: () => void;
}

export function IrrigationZoneModal({
  open,
  onClose,
}: IrrigationZoneModalProps) {
  const [name, setName] = useState("");
  const [parcelId, setParcelId] = useState("");
  const [area, setArea] = useState("");
  const [soilType, setSoilType] = useState("");
  const [irrigationType, setIrrigationType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: parcels,
    isLoading: isLoadingParcels,
    error: errorParcels,
  } = useParcels();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, we would call the API
      // await apiService.post("/irrigation/zones", {
      //   name,
      //   parcelId,
      //   area: parseFloat(area),
      //   soilType,
      //   irrigationSystem: irrigationType
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
    } catch (error) {
      console.error("Failed to create irrigation zone:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une zone d'irrigation</DialogTitle>
          <DialogDescription>
            Créez une nouvelle zone d'irrigation pour vos cultures.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la zone</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Zone Nord - Tomates"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parcel">Parcelle</Label>
              <Select value={parcelId} onValueChange={setParcelId} required>
                <SelectTrigger id="parcel">
                  <SelectValue placeholder="Sélectionnez une parcelle" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingParcels ? (
                    <SelectItem value="" disabled>
                      Chargement des parcelles...
                    </SelectItem>
                  ) : errorParcels ? (
                    <SelectItem value="" disabled>
                      Erreur de chargement des parcelles
                    </SelectItem>
                  ) : !parcels || parcels.length === 0 ? (
                    <SelectItem value="" disabled>
                      Aucune parcelle disponible
                    </SelectItem>
                  ) : (
                    parcels.map((parcel) => (
                      <SelectItem key={parcel.id} value={parcel.id}>
                        {parcel.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="area">Surface (m²)</Label>
              <Input
                id="area"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Ex: 500"
                required
              />
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
              <Label htmlFor="irrigation-type">Système d'irrigation</Label>
              <Select
                value={irrigationType}
                onValueChange={setIrrigationType}
                required
              >
                <SelectTrigger id="irrigation-type">
                  <SelectValue placeholder="Sélectionnez un système" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRIP">Goutte à goutte</SelectItem>
                  <SelectItem value="SPRINKLER">Aspersion</SelectItem>
                  <SelectItem value="SURFACE">Surface</SelectItem>
                </SelectContent>
              </Select>
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
                "Créer la zone"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
