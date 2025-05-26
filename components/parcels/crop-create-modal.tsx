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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { parcelsService } from "@/services/parcels-service";
import { useToast } from "@/components/ui/use-toast";

interface CropCreateModalProps {
  open: boolean;
  onClose: () => void;
  parcelId: string | null;
}

export function CropCreateModal({
  open,
  onClose,
  parcelId,
}: Readonly<CropCreateModalProps>) {
  const [name, setName] = useState("");
  const [variety, setVariety] = useState("");
  const [status, setStatus] = useState("planned");
  const [plantingDate, setPlantingDate] = useState<Date | undefined>(
    new Date()
  );
  const [harvestDate, setHarvestDate] = useState<Date | undefined>(undefined);
  const [area, setArea] = useState("");
  const [waterRequirement, setWaterRequirement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parcelId) {
      console.error("No parcel selected");
      return;
    }

    setIsLoading(true);

    try {
      await parcelsService.addCropToParcel(parcelId, {
        name,
        variety,
        status: status as "active" | "planned" | "harvested",
        plantingDate: plantingDate?.toISOString() ?? new Date().toISOString(),
        harvestDate: harvestDate?.toISOString() ?? "",
        area: parseFloat(area),
        waterRequirement: parseInt(waterRequirement),
        growthStage: status === "active" ? "vegetative" : null,
      });

      toast({
        title: "Culture ajoutée",
        description: "La culture a été ajoutée à la parcelle avec succès.",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create crop:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la culture. Veuillez réessayer.",
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
          <DialogTitle>Ajouter une culture</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle culture pour cette parcelle.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la culture</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Tomates"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="variety">Variété</Label>
              <Input
                id="variety"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="Ex: Roma"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planifiée</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="harvested">Récoltée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="planting-date">Date de plantation</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="planting-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !plantingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {plantingDate
                        ? format(plantingDate, "PPP", { locale: fr })
                        : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={plantingDate}
                      onSelect={setPlantingDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="harvest-date">Date de récolte prévue</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="harvest-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !harvestDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {harvestDate
                        ? format(harvestDate, "PPP", { locale: fr })
                        : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={harvestDate}
                      onSelect={setHarvestDate}
                      initialFocus
                      disabled={(date) =>
                        plantingDate ? date < plantingDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="area">Surface (hectares)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ex: 1.2"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="water-requirement">Besoin en eau (mm)</Label>
                <Input
                  id="water-requirement"
                  type="number"
                  min="0"
                  value={waterRequirement}
                  onChange={(e) => setWaterRequirement(e.target.value)}
                  placeholder="Ex: 500"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !parcelId}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Ajouter la culture"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
