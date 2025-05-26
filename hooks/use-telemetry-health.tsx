"use client";

import { useState, useEffect } from "react";
import type { TelemetryHealth } from "@/types/telemetry";
import { telemetryService } from "@/services/telemetry-service";
import { useToast } from "@/components/ui/use-toast";

interface TelemetryHealthProps {
  stationId?: string;
}

export function useTelemetryHealth({ stationId }: TelemetryHealthProps = {}) {
  const [data, setData] = useState<TelemetryHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTelemetryHealth = async () => {
      try {
        setIsLoading(true);

        try {
          // Commenter temporairement l'appel API réel pendant la panne
          // const health = await telemetryService.getStationHealth(stationId ?? "global")
          // setData(health)

          // Mock data pour visualiser l'interface
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Simuler un délai réseau

          if (stationId) {
            // Mock data pour une station spécifique
            setData({
              systemStatus: "online",
              batteryAvg: 85,
              signalStrength: 92,
              activeStations: 1,
              totalStations: 1,
              lastUpdate: new Date().toISOString(),
            });
          } else {
            // Mock data pour la vue globale
            setData({
              systemStatus: "stable",
              batteryAvg: 78,
              signalStrength: 88,
              activeStations: 8,
              totalStations: 10,
              lastUpdate: new Date().toISOString(),
            });
          }
        } catch (mockError) {
          console.warn("Using mock data due to API unavailability");
        }

        setError(null);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to fetch telemetry health");
        setError(error);
        toast({
          title: "Erreur",
          description:
            "Impossible de récupérer les données de télémétrie. Veuillez réessayer.",
          variant: "destructive",
        });
        console.error("Failed to fetch telemetry health:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTelemetryHealth();
    // Refresh every 5 minutes
    const interval = setInterval(fetchTelemetryHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [stationId, toast]);

  return { data, isLoading, error };
}
