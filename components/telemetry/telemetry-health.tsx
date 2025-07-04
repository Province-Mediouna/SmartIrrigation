"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTelemetryHealth } from "@/hooks/use-telemetry-health";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Battery, Signal, Thermometer } from "lucide-react";

export function TelemetryHealth({
  stationId,
}: {
  readonly stationId?: string;
}) {
  const { data, isLoading, error } = useTelemetryHealth({ stationId });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Santé du système
          </CardTitle>
          <div className="text-sm text-muted-foreground pt-1">
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
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
          <CardTitle className="text-sm font-medium">
            Santé du système
          </CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger les données de télémétrie. Veuillez réessayer.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Fallback data for preview
  const healthData = data || {
    systemStatus: "Opérationnel",
    batteryAvg: 72,
    signalStrength: 85,
    activeStations: 8,
    totalStations: 10,
    lastUpdate: "2023-05-14T11:30:00Z",
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
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Santé du système</CardTitle>
        <CardDescription>
          Mise à jour: {formatDate(healthData.lastUpdate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center rounded-lg border p-2">
            <Activity className="mb-1 h-4 w-4 text-green-500" />
            <div className="text-xs font-medium">État</div>
            <div className="text-xs text-muted-foreground">
              {healthData.systemStatus}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-2">
            <Battery className="mb-1 h-4 w-4 text-yellow-500" />
            <div className="text-xs font-medium">Batterie</div>
            <div className="text-xs text-muted-foreground">
              {healthData.batteryAvg}% moy.
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-2">
            <Signal className="mb-1 h-4 w-4 text-blue-500" />
            <div className="text-xs font-medium">Signal</div>
            <div className="text-xs text-muted-foreground">
              {healthData.signalStrength}%
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-2">
            <Thermometer className="mb-1 h-4 w-4 text-green-500" />
            <div className="text-xs font-medium">Stations</div>
            <div className="text-xs text-muted-foreground">
              {healthData.activeStations}/{healthData.totalStations} actives
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
