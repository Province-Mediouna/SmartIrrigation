"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/services/api-service";
import { iotService } from "@/services/iot-service";

export function useIrrigationZones() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get("/irrigation/zones");
        setData(response);
        setError(null);
      } catch (err) {
        setError(err);
        // For demo purposes, set mock data
        setData([
          {
            id: "1",
            name: "Zone Nord - Tomates",
            status: "active",
            moisture: 65,
            nextSchedule: "2023-05-14T14:30:00Z",
          },
          {
            id: "2",
            name: "Zone Sud - Concombres",
            status: "inactive",
            moisture: 78,
            nextSchedule: "2023-05-14T16:00:00Z",
          },
          {
            id: "3",
            name: "Zone Est - Laitues",
            status: "inactive",
            moisture: 42,
            nextSchedule: "2023-05-14T12:15:00Z",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchZones();
    // Refresh every 5 minutes
    const interval = setInterval(fetchZones, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const sendZoneCommand = async (zoneId: string, action: "OPEN" | "CLOSE") => {
    try {
      // On suppose que le deviceId correspond à zoneId (adapter si besoin)
      await iotService.sendCommand(zoneId, { action });
      // Optionnel : rafraîchir les données après action
      // await fetchZones()
      return true;
    } catch (err) {
      console.error("Erreur lors de l'envoi de la commande:", err);
      return false;
    }
  };

  return { data, isLoading, error, sendZoneCommand };
}
