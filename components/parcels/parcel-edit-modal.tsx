"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { Parcel } from "@/types/parcel"; // Import Parcel type
import { parcelsService } from "@/services/parcels-service"; // Import service
import { useToast } from "@/components/ui/use-toast"; // Import toast hook

interface ParcelEditModalProps {
  open: boolean;
  onClose: () => void;
  parcel: Parcel | null; // Receive parcel data
  onParcelUpdated: () => void; // Callback after update
}

export function ParcelEditModal({
  open,
  onClose,
  parcel,
  onParcelUpdated,
}: Readonly<ParcelEditModalProps>) {
  const [name, setName] = useState(parcel?.name || "");
  const [area, setArea] = useState(parcel?.area.toString() || "");
  const [latitude, setLatitude] = useState(
    parcel?.coordinates.latitude.toString() || ""
  );
  const [longitude, setLongitude] = useState(
    parcel?.coordinates.longitude.toString() || ""
  );
  const [soilType, setSoilType] = useState(parcel?.soilType || "");
  const [description, setDescription] = useState(parcel?.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Effect to update form fields when parcel prop changes
  useEffect(() => {
    if (parcel) {
      setName(parcel.name);
      setArea(parcel.area.toString());
      setLatitude(parcel.coordinates.latitude.toString());
      setLongitude(parcel.coordinates.longitude.toString());
      setSoilType(parcel.soilType);
      setDescription(parcel.description);
    } else {
      // Reset form if parcel is null (e.g., modal closed)
      setName("");
      setArea("");
      setLatitude("");
      setLongitude("");
      setSoilType("");
      setDescription("");
    }
  }, [parcel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parcel) return; // Should not happen if modal is only open when parcel is selected

    setIsLoading(true);

    try {
      // Call the update API
      await parcelsService.updateParcel(parcel.id, {
        name,
        area: parseFloat(area),
        // Assuming location update is handled via coords
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        soilType,
        description,
        // Other fields like status, etc., could be added if editable
      });

      toast({
        title: "Parcelle mise à jour",
        description: "Les informations de la parcelle ont été enregistrées.",
      });

      onClose();
      onParcelUpdated(); // Notify parent to refetch data
    } catch (error) {
      console.error("Failed to update parcel:", error);
      toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour la parcelle. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la parcelle</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de la parcelle "{parcel?.name || ""}
            ".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nom de la parcelle</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Parcelle Nord"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-area">Surface (hectares)</Label>
              <Input
                id="edit-area"
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
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input
                  id="edit-latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Ex: 33.5731"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input
                  id="edit-longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Ex: -7.5898"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-soil-type">Type de sol</Label>
              <Select value={soilType} onValueChange={setSoilType} required>
                <SelectTrigger id="edit-soil-type">
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
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
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
            <Button type="submit" disabled={isLoading || !parcel}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
