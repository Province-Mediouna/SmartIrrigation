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
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Télémétrie</h1>
          <p className="text-muted-foreground">
            Visualisez et analysez les données télémétriques de vos stations en
            temps réel
          </p>
        </div>
        <Button variant="outline" onClick={downloadAllMetrics}>
          <Download className="mr-2 h-4 w-4" />
          Tout exporter
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stations</CardTitle>
              <CardDescription>Sélectionnez une station météo</CardDescription>
            </CardHeader>
            <CardContent>
              <StationList
                selectedStationId={selectedStation}
                onSelectStation={setSelectedStation}
                size={5}
              />
            </CardContent>
          </Card>

          <TelemetryHealth stationId={selectedStation} />
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {metrics.map(
              (metric) =>
                selectedStation && (
                  <MetricChart
                    key={metric}
                    stationId={selectedStation}
                    metric={metric}
                  />
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
