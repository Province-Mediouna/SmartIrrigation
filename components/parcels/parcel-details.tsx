"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Droplets, Leaf, Edit, Trash2 } from "lucide-react";
import type { Parcel } from "@/types/parcel";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ParcelEditModal } from "./parcel-edit-modal";
import { useParcels } from "@/hooks/use-parcels";

interface ParcelDetailsProps {
  parcel: Parcel;
}

export function ParcelDetails({ parcel }: ParcelDetailsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { refetch } = useParcels();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleDelete = async () => {
    // In a real app, we would call the API to delete the parcel
    // await apiService.delete(`/parcels/${parcel.id}`);
    console.log("Deleting parcel:", parcel.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{parcel.name}</CardTitle>
              <CardDescription>ID: {parcel.id}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {parcel.coordinates && (
            <div className="rounded-lg border p-3 h-64 bg-gray-100 flex items-center justify-center text-muted-foreground">
              Vue carte de la parcelle ({parcel.coordinates.latitude}°,{" "}
              {parcel.coordinates.longitude}°)
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Localisation
              </div>
              <p className="text-sm">{parcel.location}</p>
              <p className="text-sm">
                Latitude: {parcel.coordinates.latitude}°
              </p>
              <p className="text-sm">
                Longitude: {parcel.coordinates.longitude}°
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Informations
              </div>
              <p className="text-sm">
                Créée le: {formatDate(parcel.createdAt)}
              </p>
              <p className="text-sm">Surface: {parcel.area} hectares</p>
              <div className="text-sm">
                Statut:{" "}
                <Badge
                  variant={parcel.status === "active" ? "default" : "outline"}
                >
                  {parcel.status}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Leaf className="h-4 w-4 text-muted-foreground" />
                Cultures
              </div>
              <p className="text-sm">Cultures actives: {parcel.activeCrops}</p>
              <p className="text-sm">
                Cultures historiques: {parcel.cropCount}
              </p>
              <p className="text-sm">Type de sol: {parcel.soilType}</p>
            </div>

            <div className="rounded-lg border p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                Irrigation
              </div>
              <p className="text-sm">
                Zones d'irrigation: {parcel.irrigationZones}
              </p>
              <p className="text-sm">
                Consommation d'eau: {parcel.waterUsage} m³/mois
              </p>
              <p className="text-sm">
                Efficacité: {parcel.irrigationEfficiency}%
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-2 text-sm font-medium">Description</div>
            <p className="text-sm text-muted-foreground">
              {parcel.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cette parcelle ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à
              cette parcelle seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ParcelEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        parcel={parcel}
        onParcelUpdated={refetch}
      />
    </>
  );
}
