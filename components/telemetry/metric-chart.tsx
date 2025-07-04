"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DownloadCloud,
  Thermometer,
  Droplets,
  Battery,
  Sun,
  Wind,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTelemetryMetrics, MetricType } from "@/hooks/use-telemetry-metrics";

interface MetricChartProps {
  stationId: string;
  metric: MetricType;
}

export function MetricChart({ stationId, metric }: MetricChartProps) {
  const { data, isLoading, error } = useTelemetryMetrics({ stationId, metric });

  const getMetricIcon = () => {
    switch (metric) {
      case "temperature":
        return <Thermometer className="h-4 w-4 text-red-500" />;
      case "humidity":
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case "battery":
        return <Battery className="h-4 w-4 text-green-500" />;
      case "radiation":
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case "wind":
        return <Wind className="h-4 w-4 text-cyan-500" />;
    }
  };

  const getMetricTitle = () => {
    switch (metric) {
      case "temperature":
        return "Température";
      case "humidity":
        return "Humidité";
      case "battery":
        return "Batterie";
      case "radiation":
        return "Rayonnement";
      case "wind":
        return "Vent";
    }
  };

  const getMetricUnit = () => {
    switch (metric) {
      case "temperature":
        return "°C";
      case "humidity":
        return "%";
      case "battery":
        return "%";
      case "radiation":
        return "W/m²";
      case "wind":
        return "km/h";
    }
  };

  const getLineColor = () => {
    switch (metric) {
      case "temperature":
        return "#ef4444"; // red
      case "humidity":
        return "#3b82f6"; // blue
      case "battery":
        return "#22c55e"; // green
      case "radiation":
        return "#eab308"; // yellow
      case "wind":
        return "#06b6d4"; // cyan
      default:
        return "#6366f1"; // indigo
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadCSV = () => {
    // Préparer les données CSV
    const headers = ["Date", getMetricTitle(), "Unité"];
    const rows = data.map((d) => [
      new Date(d.timestamp).toLocaleString("fr-FR"),
      d.value,
      getMetricUnit(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    // Créer et télécharger le fichier
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `telemetry_${metric}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            {getMetricIcon()}
            {getMetricTitle()}
          </CardTitle>
          <CardDescription>
            <span>
              <Skeleton className="h-4 w-24" />
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            {getMetricIcon()}
            {getMetricTitle()}
          </CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger les données de{" "}
            {getMetricTitle().toLowerCase()}. Veuillez réessayer.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              {getMetricIcon()}
              {getMetricTitle()}
            </CardTitle>
            <CardDescription className="flex items-center justify-between">
              <span>Dernières 24 heures</span>
              <span className="font-medium">
                {currentValue}
                {getMetricUnit()}
              </span>
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={downloadCSV}
            title="Exporter en CSV"
          >
            <DownloadCloud className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.map((d) => ({
                time: formatDate(d.timestamp),
                value: d.value,
              }))}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#888"
                opacity={0.2}
              />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                domain={
                  metric === "temperature"
                    ? ["dataMin - 2", "dataMax + 2"]
                    : metric === "humidity" || metric === "battery"
                    ? [0, 100]
                    : ["dataMin", "dataMax"]
                }
              />
              <Tooltip
                contentStyle={{ fontSize: "12px" }}
                formatter={(value: number) => [
                  `${value}${getMetricUnit()}`,
                  getMetricTitle(),
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={getLineColor()}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
