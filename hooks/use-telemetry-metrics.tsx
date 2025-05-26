"use client";

import { useState, useEffect } from "react";
import type { TelemetryMetric } from "@/types/telemetry";
import { telemetryService } from "@/services/telemetry-service";
import { useToast } from "@/components/ui/use-toast";

export type MetricType =
  | "temperature"
  | "humidity"
  | "battery"
  | "radiation"
  | "wind";

// Fonction utilitaire pour les unités de mesure
function getMetricUnit(metric: MetricType): string {
  switch (metric) {
    case "temperature":
      return "°C";
    case "humidity":
    case "battery":
      return "%";
    case "radiation":
      return "W/m²";
    case "wind":
      return "km/h";
    default:
      return "";
  }
}

interface UseTelemetryMetricsProps {
  stationId: string;
  metric: MetricType;
  startDate?: Date;
  endDate?: Date;
  interval?: "hour" | "day" | "week" | "month";
}

export function useTelemetryMetrics({
  stationId,
  metric,
  startDate = new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24h by default
  endDate = new Date(),
  interval = "hour",
}: UseTelemetryMetricsProps) {
  const [data, setData] = useState<TelemetryMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);

        try {
          // Commenter temporairement l'appel API réel pendant la panne
          // const response = await telemetryService.getStationMetrics(stationId, {
          //   startDate,
          //   endDate,
          //   page: 1,
          //   size: 1000,
          // })
          // const metrics = response.data
          //   .filter(m => m.timestamp >= startDate.toISOString() && m.timestamp <= endDate.toISOString())
          //   .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          // setData(metrics)

          // Mock data pour visualiser l'interface
          await new Promise((resolve) => setTimeout(resolve, 800)); // Simuler un délai réseau

          // Générer 24 points de données sur les dernières 24 heures
          const mockData = [];
          const now = new Date();

          for (let i = 23; i >= 0; i--) {
            const timestamp = new Date(
              now.getTime() - i * 60 * 60 * 1000
            ).toISOString();
            let value: number;

            switch (metric) {
              case "temperature":
                // Température entre 18 et 28°C avec variation sinusoïdale
                value = 23 + Math.sin(i / 4) * 5 + (Math.random() - 0.5) * 2;
                break;
              case "humidity":
                // Humidité entre 40% et 70%
                value = 55 + Math.sin(i / 6) * 15 + (Math.random() - 0.5) * 5;
                break;
              case "battery":
                // Batterie décroissante de 100% à 85%
                value = 100 - (i / 24) * 15 + (Math.random() - 0.5) * 2;
                break;
              case "radiation":
                // Rayonnement solaire (W/m²) avec cycle jour/nuit
                const hour = (24 - i) % 24;
                const daylight = Math.sin(((hour - 6) * Math.PI) / 12); // Pic à midi
                value = Math.max(
                  0,
                  daylight * 800 + (Math.random() - 0.5) * 50
                );
                break;
              case "wind":
                // Vitesse du vent entre 0 et 30 km/h
                value = 15 + Math.sin(i / 4) * 10 + (Math.random() - 0.5) * 5;
                break;
              default:
                value = 50 + Math.sin(i / 4) * 10;
            }

            mockData.push({
              timestamp,
              value: Number(value.toFixed(1)),
              unit: getMetricUnit(metric),
            });
          }

          setData(mockData);
        } catch (mockError) {
          console.warn("Using mock data due to API unavailability");
        }

        setError(null);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error(`Failed to fetch ${metric} data`);
        setError(error);
        toast({
          title: "Erreur",
          description: `Impossible de récupérer les données de ${metric.toLowerCase()}. Veuillez réessayer.`,
          variant: "destructive",
        });
        console.error(`Failed to fetch ${metric} data:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    // Refresh every minute for real-time data
    const interval = setInterval(fetchMetrics, 60 * 1000);
    return () => clearInterval(interval);
  }, [stationId, metric, startDate, endDate, interval, toast]);

  return { data, isLoading, error };
}
