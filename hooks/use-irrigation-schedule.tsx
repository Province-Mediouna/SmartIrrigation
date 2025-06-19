import { useState, useEffect, useCallback } from "react";
import { irrigationService } from "@/services/irrigation-service";
import type {
  IrrigationSchedule,
  OptimizationResult,
} from "@/types/irrigation";

export function useIrrigationSchedule(zoneId: string) {
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(
    null
  );
  const [optimizing, setOptimizing] = useState(false);

  const fetchSchedules = useCallback(async () => {
    if (!zoneId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await irrigationService.getSchedulesByZone(zoneId);
      setSchedules(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des plannings");
    } finally {
      setLoading(false);
    }
  }, [zoneId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const createSchedule = async (schedule: Partial<IrrigationSchedule>) => {
    setLoading(true);
    setError(null);
    try {
      await irrigationService.createSchedule(schedule);
      await fetchSchedules();
      return true;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du planning");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (
    scheduleId: string,
    schedule: Partial<IrrigationSchedule>
  ) => {
    setLoading(true);
    setError(null);
    try {
      await irrigationService.updateSchedule(scheduleId, schedule);
      await fetchSchedules();
      return true;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la modification du planning");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    setLoading(true);
    setError(null);
    try {
      await irrigationService.deleteSchedule(scheduleId);
      await fetchSchedules();
      return true;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression du planning");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const optimizeSchedule = async (params?: Record<string, any>) => {
    setOptimizing(true);
    setError(null);
    try {
      const result = await irrigationService.optimizeSchedule(zoneId, params);
      setOptimization(result);
      return result;
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'optimisation");
      return null;
    } finally {
      setOptimizing(false);
    }
  };

  return {
    schedules,
    loading,
    error,
    optimization,
    optimizing,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    optimizeSchedule,
  };
}
