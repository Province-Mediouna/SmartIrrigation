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
import { useStations } from "@/hooks/use-stations";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, AlertCircle, Plus } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

export function StationList({
  page = 1,
  size = 10,
  status,
  search,
  onSelectStation,
  selectedStationId,
  onPageChange,
}: {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  onSelectStation?: (stationId: string) => void;
  selectedStationId?: string | null;
  onPageChange?: (page: number) => void;
} = {}) {
  const { data, isLoading, error, total } = useStations({
    page,
    size,
    status,
    search,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stations</CardTitle>
              <CardDescription>Liste des stations météo</CardDescription>
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
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
          <CardTitle>Stations</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger les stations. Veuillez réessayer.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Fallback data for preview
  const stations = data || [
    {
      id: "1",
      name: "Station Nord",
      status: "online",
      lastUpdate: "2023-05-14T10:30:00Z",
      batteryLevel: 85,
      firmwareVersion: "2.3.1",
    },
    {
      id: "2",
      name: "Station Sud",
      status: "offline",
      lastUpdate: "2023-05-13T18:45:00Z",
      batteryLevel: 12,
      firmwareVersion: "2.3.0",
    },
    {
      id: "3",
      name: "Station Est",
      status: "warning",
      lastUpdate: "2023-05-14T09:15:00Z",
      batteryLevel: 42,
      firmwareVersion: "2.3.1",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "offline":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
          >
            En ligne
          </Badge>
        );
      case "offline":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          >
            Hors ligne
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
          >
            Avertissement
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Stations</CardTitle>
            <CardDescription>Liste des stations météo</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stations.map((station) => (
            <div
              key={station.id}
              className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer ${
                selectedStationId === station.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelectStation && onSelectStation(station.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  {getStatusIcon(station.status)}
                </div>
                <div>
                  <div className="font-medium">{station.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Mise à jour: {formatDate(station.lastUpdate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">
                  Batterie: {station.batteryLevel}%
                </div>
                {getStatusBadge(station.status)}
              </div>
            </div>
          ))}
        </div>
        {total && total > size && onPageChange && (
          <div className="mt-4">
            <Pagination
              totalItems={total}
              itemsPerPage={size}
              currentPage={page}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
