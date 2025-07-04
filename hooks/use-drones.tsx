"use client";

import { useState, useEffect } from "react";
import { dronesService } from "@/services/drones-service";
import type { Drone } from "@/types/drone";

export function useDrones(options?: { page?: number; pageSize?: number }) {
  const [data, setData] = useState<Drone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await dronesService.getAllDrones();

        setData(response);
        setTotalItems(response.length);
        setTotalPages(0); // Note: getAllDrones ne prend pas d'options de pagination dans le service actuel.
        // La pagination devra être gérée côté client si nécessaire.
      } catch (err) {
        console.error("Failed to fetch drones:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch drones")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrones();
  }, [options?.page, options?.pageSize]);

  return {
    data,
    isLoading,
    error,
    totalItems,
    totalPages,
  };
}
