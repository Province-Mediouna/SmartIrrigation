"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/services/api-service";
import type { Station } from "@/types/station";

export function useStations({
  page = 1,
  size = 10,
  status,
  search,
}: { page?: number; size?: number; status?: string; search?: string } = {}) {
  const [data, setData] = useState<Station[] | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        // Appel avec pagination, filtrage, recherche
        const params: any = { page, size };
        if (status) params.status = status;
        if (search) params.search = search;
        const response = await apiService.get<{
          data: Station[];
          total: number;
        }>("/stations", { params });
        setData(response.data);
        setTotal(response.total);
        setError(null);
      } catch (err) {
        setError(err as Error);
        // Mock fallback
        setData([
          {
            id: "1",
            name: "Station Nord",
            status: "online",
            lastUpdate: "2023-05-14T10:30:00Z",
            batteryLevel: 85,
            firmwareVersion: "2.3.1",
            location: {
              latitude: 48.86,
              longitude: 2.33,
              altitude: 100,
              address: "123 Main Street, Paris, France",
            },
            signalStrength: 90,
            sensors: [
              {
                id: "1",
                type: "temperature",
                status: "active",
                lastCalibration: "2023-05-14T10:30:00Z",
                accuracy: 0.5,
                unit: "°C",
              },
            ],
            type: "fixed",
            installationDate: "2022-04-10T00:00:00Z",
          },
        ]);
        setTotal(1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStations();
    const interval = setInterval(fetchStations, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [page, size, status, search]);

  return { data, isLoading, error, total };
}
