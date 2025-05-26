"use client";

import { useState } from "react";
import { ParcelList } from "@/components/parcels/parcel-list";
import { ParcelDetails } from "@/components/parcels/parcel-details";
import { CropHistory } from "@/components/parcels/crop-history";
import { SoilData } from "@/components/parcels/soil-data";
import { Button } from "@/components/ui/button";
import { Plus, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ParcelCreateModal } from "@/components/parcels/parcel-create-modal";
import { CropCreateModal } from "@/components/parcels/crop-create-modal";
import { useParcels } from "@/hooks/use-parcels";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ParcelsPage() {
  const {
    data: parcels,
    isLoading,
    total,
    page,
    pageSize,
    filters,
    setFilters,
  } = useParcels();
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [showCreateParcelModal, setShowCreateParcelModal] = useState(false);
  const [showCreateCropModal, setShowCreateCropModal] = useState(false);

  const selectedParcel =
    parcels?.find((parcel) => parcel.id === selectedParcelId) || null;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parcelles & Cultures</h1>
          <p className="text-muted-foreground">
            Gestion des parcelles agricoles et des cultures
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCreateCropModal(true)}
          >
            <Layers className="mr-2 h-4 w-4" />
            Ajouter une culture
          </Button>
          <Button onClick={() => setShowCreateParcelModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une parcelle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Parcelles</CardTitle>
              <CardDescription>
                Sélectionnez une parcelle pour voir les détails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-2">
                <Input
                  placeholder="Rechercher par nom ou localisation..."
                  value={filters.search || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
                <Select
                  value={filters.status || ""}
                  onValueChange={(value) =>
                    setFilters({ ...filters, status: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.soilType || ""}
                  onValueChange={(value) =>
                    setFilters({ ...filters, soilType: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par type de sol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous types de sol</SelectItem>
                    <SelectItem value="CLAY">Argileux</SelectItem>
                    <SelectItem value="SANDY">Sableux</SelectItem>
                    <SelectItem value="LOAM">Limoneux</SelectItem>
                    <SelectItem value="SILT">Silteux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ParcelList
                onSelectParcel={(parcelId) => setSelectedParcelId(parcelId)}
                selectedParcelId={selectedParcelId}
              />

              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({ ...filters, page: (filters.page || 1) - 1 })
                  }
                  disabled={(filters.page || 1) <= 1}
                >
                  Précédent
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {filters.page || 1} sur{" "}
                  {Math.ceil(total / (filters.size || 10))}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({ ...filters, page: (filters.page || 1) + 1 })
                  }
                  disabled={(filters.page || 1) * (filters.size || 10) >= total}
                >
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedParcelId ? (
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="crops">Cultures</TabsTrigger>
                <TabsTrigger value="soil">Données du sol</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                {selectedParcel && <ParcelDetails parcel={selectedParcel} />}
              </TabsContent>

              <TabsContent value="crops">
                <CropHistory
                  parcelId={selectedParcelId}
                  onAddCrop={() => setShowCreateCropModal(true)}
                />
              </TabsContent>

              <TabsContent value="soil">
                <SoilData parcelId={selectedParcelId} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex h-40 flex-col items-center justify-center">
                <p className="text-muted-foreground">
                  Sélectionnez une parcelle pour voir les détails
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ParcelCreateModal
        open={showCreateParcelModal}
        onClose={() => setShowCreateParcelModal(false)}
      />
      <CropCreateModal
        open={showCreateCropModal}
        onClose={() => setShowCreateCropModal(false)}
        parcelId={selectedParcelId}
      />
    </div>
  );
}
