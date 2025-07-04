"use client";

import { useState } from "react";
import { ParcelList } from "@/components/parcels/parcel-list";
import { ParcelDetails } from "@/components/parcels/parcel-details";
import { CropHistory } from "@/components/parcels/crop-history";
import { SoilData } from "@/components/parcels/soil-data";
import { Button } from "@/components/ui/button";
import { Plus, Layers, Search, Filter, MapPin, Leaf } from "lucide-react";
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
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

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

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Parcelles & Cultures", href: "/parcels" },
  ];

  if (selectedParcel) {
    breadcrumbItems.push({ label: selectedParcel.name });
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* En-tête avec breadcrumb */}
      <div className="space-y-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <Leaf className="w-10 h-10 text-green-600" />
              Parcelles & Cultures
            </h1>
            <p className="text-lg text-muted-foreground">
              Gestion des parcelles agricoles et des cultures
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateCropModal(true)}
              className="shadow-sm hover:shadow-md"
            >
              <Layers className="mr-2 h-4 w-4" />
              Ajouter une culture
            </Button>
            <Button
              onClick={() => setShowCreateParcelModal(true)}
              className="gradient-primary hover:shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une parcelle
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total parcelles
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {total || 0}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cultures actives
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {parcels?.filter((p) => p.currentCrop).length || 0}
                </p>
              </div>
              <Leaf className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Surface totale
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {parcels
                    ?.reduce((sum, p) => sum + (p.area || 0), 0)
                    .toFixed(1) || 0}{" "}
                  ha
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                  ha
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rendement moyen
                </p>
                <p className="text-2xl font-bold text-foreground">85%</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Parcelles
              </CardTitle>
              <CardDescription>
                Sélectionnez une parcelle pour voir les détails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtres améliorés */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou localisation..."
                    value={filters.search || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <Select
                    value={filters.status || ""}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value || undefined })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Statut" />
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
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Type de sol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous types</SelectItem>
                      <SelectItem value="CLAY">Argileux</SelectItem>
                      <SelectItem value="SANDY">Sableux</SelectItem>
                      <SelectItem value="LOAM">Limoneux</SelectItem>
                      <SelectItem value="SILT">Silteux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Liste des parcelles */}
              <div className="border rounded-lg">
                <ParcelList
                  onSelectParcel={(parcelId) => setSelectedParcelId(parcelId)}
                  selectedParcelId={selectedParcelId}
                />
              </div>

              {/* Pagination améliorée */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({ ...filters, page: (filters.page || 1) - 1 })
                  }
                  disabled={(filters.page || 1) <= 1}
                  className="hover:shadow-sm"
                >
                  Précédent
                </Button>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    Page {filters.page || 1} sur{" "}
                    {Math.ceil(total / (filters.size || 10))}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({ ...filters, page: (filters.page || 1) + 1 })
                  }
                  disabled={(filters.page || 1) * (filters.size || 10) >= total}
                  className="hover:shadow-sm"
                >
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedParcelId ? (
            <div className="animate-fade-in">
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="details"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Détails
                  </TabsTrigger>
                  <TabsTrigger
                    value="crops"
                    className="flex items-center gap-2"
                  >
                    <Leaf className="w-4 h-4" />
                    Cultures
                  </TabsTrigger>
                  <TabsTrigger value="soil" className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-brown-500 rounded-full" />
                    Sol
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  {selectedParcel && <ParcelDetails parcel={selectedParcel} />}
                </TabsContent>

                <TabsContent value="crops" className="space-y-4">
                  <CropHistory
                    parcelId={selectedParcelId}
                    onAddCrop={() => setShowCreateCropModal(true)}
                  />
                </TabsContent>

                <TabsContent value="soil" className="space-y-4">
                  <SoilData parcelId={selectedParcelId} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex h-64 flex-col items-center justify-center space-y-4">
                <MapPin className="h-16 w-16 text-muted-foreground/50" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    Aucune parcelle sélectionnée
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez une parcelle dans la liste pour voir les
                    détails
                  </p>
                </div>
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
      />
    </div>
  );
}
