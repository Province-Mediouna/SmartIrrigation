"use client";

import { useState } from "react";
import { StationList } from "@/components/stations/station-list";
import { TelemetryHealth } from "@/components/telemetry/telemetry-health";
import { MetricChart } from "@/components/telemetry/metric-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from "lucide-react";
import type { MetricType } from "@/hooks/use-telemetry-metrics";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Wifi, AlertTriangle, BarChart3 } from "lucide-react";

export default function TelemetryPage() {
  const [selectedStation, setSelectedStation] = useState<string | undefined>(
    undefined
  );
  const metrics: MetricType[] = [
    "temperature",
    "humidity",
    "battery",
    "radiation",
    "wind",
  ];

  const downloadAllMetrics = () => {
    // TODO: Implement bulk download of all metrics
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center gap-3">
            <Thermometer className="w-7 h-7 text-orange-500" /> Télémétrie &
            Santé
          </h1>
          <p className="mt-2 text-base text-muted-foreground font-medium">
            Suivi de la santé et des données télémétriques du système
          </p>
        </div>
        <Badge
          className="self-start md:self-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          aria-label="Système stable"
        >
          Système stable
        </Badge>
      </div>
      {/* Section Vue d'ensemble */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Thermometer className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Température
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24°C</div>
            <div className="text-sm text-muted-foreground">moyenne</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Wifi className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Signal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">88%</div>
            <div className="text-sm text-muted-foreground">connectivité</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertTriangle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">en cours</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BarChart3 className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Dernier relevé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">26/06 19:05</div>
            <div className="text-sm text-muted-foreground">date/heure</div>
          </CardContent>
        </Card>
      </section>
      {/* Widgets principaux */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-xl transition-shadow focus-within:ring-2 focus-within:ring-primary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Santé du système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TelemetryHealth />
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-xl transition-shadow focus-within:ring-2 focus-within:ring-primary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Historique des métriques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MetricChart />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
