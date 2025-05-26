"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Leaf,
  Calendar,
  Droplets,
  Plus,
  ArrowUpDown,
  BarChart,
  Table,
} from "lucide-react";
import type { Crop } from "@/types/crop";
import { CropCalendar } from "./crop-calendar";
import { CropPerformance } from "./crop-performance";
import { parcelsService } from "@/services/parcels-service";
import { useToast } from "@/components/ui/use-toast";

interface CropHistoryProps {
  parcelId: string;
  onAddCrop: () => void;
}

export function CropHistory({
  parcelId,
  onAddCrop,
}: Readonly<CropHistoryProps>) {
  const [crops, setCrops] = useState<Crop[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setIsLoading(true);
        const cropsList = await parcelsService.getParcelCrops(parcelId);
        setCrops(cropsList);
        setError(null);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch crops");
        setError(error);
        toast({
          title: "Erreur",
          description:
            "Impossible de récupérer les cultures. Veuillez réessayer.",
          variant: "destructive",
        });
        console.error("Failed to fetch crops:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (parcelId) {
      fetchCrops();
    }
  }, [parcelId, toast]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non défini";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        );
      case "planned":
        return (
          <Badge
            variant="outline"
            className="border-blue-200 text-blue-800 dark:border-blue-800 dark:text-blue-300"
          >
            Planifiée
          </Badge>
        );
      case "harvested":
        return (
          <Badge
            variant="outline"
            className="border-amber-200 text-amber-800 dark:border-amber-800 dark:text-amber-300"
          >
            Récoltée
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGrowthStageName = (stage: string | null) => {
    if (!stage) return "Non défini";

    const stageMap: Record<string, string> = {
      germination: "Germination",
      seedling: "Plantule",
      vegetative: "Végétative",
      flowering: "Floraison",
      fruiting: "Fructification",
      ripening: "Maturation",
      harvested: "Récoltée",
    };

    return stageMap[stage] || stage;
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedCrops = crops
    ? [...crops].sort((a, b) => {
        const dateA = new Date(a.plantingDate).getTime();
        const dateB = new Date(b.plantingDate).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      })
    : null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des cultures</CardTitle>
              <CardDescription>
                Cultures passées, actuelles et planifiées
              </CardDescription>
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des cultures</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger l'historique des cultures. Veuillez réessayer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des cultures</CardTitle>
              <CardDescription>
                Cultures passées, actuelles et planifiées
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSortOrder}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortOrder === "asc" ? "Plus récentes" : "Plus anciennes"}
              </Button>
              <Button size="sm" onClick={onAddCrop}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardHeader>
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <BarChart className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <CardContent>
              {!sortedCrops || sortedCrops.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Leaf className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-medium">Aucune culture</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Cette parcelle n'a pas encore de cultures enregistrées.
                  </p>
                  <Button onClick={onAddCrop}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une culture
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedCrops.map((crop) => (
                    <div key={crop.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{crop.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Variété: {crop.variety}
                          </p>
                        </div>
                        <div>{getStatusBadge(crop.status)}</div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Plantation: {formatDate(crop.plantingDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Récolte: {formatDate(crop.harvestDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Leaf className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Stade: {getGrowthStageName(crop.growthStage)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Droplets className="h-4 w-4 text-muted-foreground" />
                          <span>Besoin en eau: {crop.waterRequirement} mm</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Rendement:{" "}
                            {crop.yield
                              ? `${crop.yield} t/ha`
                              : "Non disponible"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Leaf className="h-4 w-4 text-muted-foreground" />
                          <span>Surface: {crop.area} ha</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </TabsContent>

          <TabsContent value="calendar">
            <CardContent>
              {sortedCrops && <CropCalendar crops={sortedCrops} />}
            </CardContent>
          </TabsContent>

          <TabsContent value="performance">
            <CardContent>
              {sortedCrops && <CropPerformance crops={sortedCrops} />}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
