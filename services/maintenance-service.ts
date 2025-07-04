import { ApiService } from "./api-service"
import type { MaintenanceTask, MaintenanceTaskFilter, MaintenanceTaskCreate } from "../types/maintenance"
import { MOCK_MAINTENANCE_TASKS } from "@/lib/mocks/maintenance-mocks"

// Mock data for maintenance tasks
const MOCK_TASKS: MaintenanceTask[] = [
  // Add some mock tasks here
  {
    id: "task-1",
    title: "Check irrigation system in Zone Nord",
    description: "Inspect all sprinklers and pipes for leaks.",
    status: "pending",
    priority: "high",
    assignedTo: null,
    stationId: "station-abc",
    parcelId: "parcel-1",
    deviceId: null,
    createdAt: "2023-10-26T10:00:00Z",
    updatedAt: "2023-10-26T10:00:00Z",
    dueDate: "2023-11-01T17:00:00Z",
    estimatedDuration: 60,
  },
   {
    id: "task-2",
    title: "Recalibrate soil moisture sensor in Zone Sud",
    description: "Verify sensor readings against manual measurements.",
    status: "in_progress",
    priority: "medium",
    assignedTo: "user-123",
    stationId: "station-def",
    parcelId: "parcel-2",
    deviceId: "sensor-xyz",
    createdAt: "2023-10-25T09:00:00Z",
    updatedAt: "2023-10-26T11:00:00Z",
    dueDate: "2023-11-05T12:00:00Z",
    estimatedDuration: 30,
  },
    {
    id: "task-3",
    title: "Perform drone battery health check",
    description: "Check voltage and capacity of all drone batteries.",
    status: "completed",
    priority: "low",
    assignedTo: "user-456",
    stationId: null,
    parcelId: null,
    deviceId: "drone-789",
    createdAt: "2023-10-24T14:00:00Z",
    updatedAt: "2023-10-25T09:30:00Z",
    dueDate: "2023-10-30T10:00:00Z",
    completedAt: "2023-10-25T09:30:00Z",
    estimatedDuration: 90,
    actualDuration: 75,
  },
     {
    id: "task-4",
    title: "Inspect greenhouse ventilation fans",
    description: "Clean and test all ventilation fans.",
    status: "pending",
    priority: "medium",
    assignedTo: null,
    stationId: "station-ghi",
    parcelId: null,
    deviceId: null,
    createdAt: "2023-10-26T11:00:00Z",
    updatedAt: "2023-10-26T11:00:00Z",
    dueDate: "2023-11-03T14:00:00Z",
    estimatedDuration: 120,
  },
      {
    id: "task-5",
    title: "Update firmware for main irrigation controller",
    description: "Apply the latest firmware patch.",
    status: "pending",
    priority: "high",
    assignedTo: "user-123",
    stationId: "station-abc",
    parcelId: null,
    deviceId: "controller-101",
    createdAt: "2023-10-26T11:30:00Z",
    updatedAt: "2023-10-26T11:30:00Z",
    dueDate: "2023-11-02T09:00:00Z",
    estimatedDuration: 45,
  },
      {
    id: "task-6",
    title: "Check water pump pressure",
    description: "Monitor pump pressure during irrigation cycles.",
    status: "completed",
    priority: "low",
    assignedTo: "user-456",
    stationId: "station-def",
    parcelId: null,
    deviceId: "pump-202",
    createdAt: "2023-10-23T10:00:00Z",
    updatedAt: "2023-10-24T08:00:00Z",
    dueDate: "2023-10-28T11:00:00Z",
    completedAt: "2023-10-24T08:00:00Z",
    estimatedDuration: 60,
    actualDuration: 50,
  },
];

class MaintenanceService extends ApiService {
  private readonly MAINTENANCE_ENDPOINT = "/maintenance"

  // Récupérer la liste des tâches de maintenance avec pagination et filtres
  async getTasks(
    filters: MaintenanceTaskFilter = {},
  ): Promise<{ data: MaintenanceTask[]; total: number; page: number; size: number }> {
    try {
      // Simulate fetching and filtering tasks
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      let filteredTasks = [...MOCK_TASKS];

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }
      if (filters.priority && filters.priority !== 'all') {
         filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
           task.title.toLowerCase().includes(searchTerm) ||
           task.description?.toLowerCase().includes(searchTerm) ||
           task.assignedTo?.toLowerCase().includes(searchTerm) ||
           task.stationId?.toLowerCase().includes(searchTerm) ||
           task.parcelId?.toLowerCase().includes(searchTerm) ||
           task.deviceId?.toLowerCase().includes(searchTerm)
        );
      }
       if (filters.startDate) {
        filteredTasks = filteredTasks.filter(task =>
          new Date(task.dueDate) >= filters.startDate
        );
      }
      if (filters.endDate) {
         filteredTasks = filteredTasks.filter(task =>
          new Date(task.dueDate) <= filters.endDate
        );
      }

      // Apply pagination
      const page = filters.page ?? 1;
      const size = filters.size ?? 10;
      const startIndex = (page - 1) * size;
      const paginatedTasks = filteredTasks.slice(startIndex, startIndex + size);

      return { data: paginatedTasks, total: filteredTasks.length, page, size };

      // Original API call (commented out)
      // const queryParams = new URLSearchParams();
      // Object.entries(filters).forEach(([key, value]) => {
      //   if (value !== undefined) {
      //      if (value instanceof Date) {
      //         queryParams.append(key, value.toISOString());
      //      } else if (Array.isArray(value)){
      //          value.forEach(item => queryParams.append(key, item));
      //      } else {
      //           queryParams.append(key, String(value));
      //      }
      //   }
      // });
      // return await this.get<{ data: MaintenanceTask[]; total: number; page: number; size: number }>(
      //   `${this.MAINTENANCE_ENDPOINT}/tasks?${queryParams.toString()}`,
      // )
    } catch (error) {
      console.error("Failed to get maintenance tasks:", error)
      throw error
    }
  }

  // Créer une nouvelle tâche de maintenance
  async createTask(task: MaintenanceTaskCreate): Promise<MaintenanceTask> {
    try {
      return await this.post<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks`, task)
    } catch (error) {
      console.error("Failed to create maintenance task:", error)
      throw error
    }
  }

  // Récupérer une tâche de maintenance par son ID
  async getTaskById(taskId: string): Promise<MaintenanceTask> {
    try {
      return await this.get<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks/${taskId}`)
    } catch (error) {
      console.error(`Failed to get maintenance task ${taskId}:`, error)
      throw error
    }
  }

  // Mettre à jour une tâche de maintenance
  async updateTask(taskId: string, updates: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
    try {
      return await this.put<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks/${taskId}`, updates)
    } catch (error) {
      console.error(`Failed to update maintenance task ${taskId}:`, error)
      throw error
    }
  }

  // Marquer une tâche comme terminée
  async completeTask(taskId: string, notes?: string): Promise<MaintenanceTask> {
    try {
      return await this.post<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks/${taskId}/complete`, { notes })
    } catch (error) {
      console.error(`Failed to complete maintenance task ${taskId}:`, error)
      throw error
    }
  }

  // Assigner une tâche à un technicien
  async assignTask(taskId: string, technicianId: string): Promise<MaintenanceTask> {
    try {
      return await this.post<MaintenanceTask>(`${this.MAINTENANCE_ENDPOINT}/tasks/${taskId}/assign`, { technicianId })
    } catch (error) {
      console.error(`Failed to assign maintenance task ${taskId}:`, error)
      throw error
    }
  }

  // Récupérer les statistiques de maintenance
  async getMaintenanceStats(stationId?: string): Promise<any> {
    try {
      const queryParams = new URLSearchParams()
      if (stationId) queryParams.append("stationId", stationId)

      return await this.get<any>(`${this.MAINTENANCE_ENDPOINT}/stats?${queryParams.toString()}`)
    } catch (error) {
      console.error("Failed to get maintenance statistics:", error)
      throw error
    }
  }

  async getAllTasks(): Promise<MaintenanceTask[]> {
    try {
      return await this.get<MaintenanceTask[]>("maintenance/tasks");
    } catch (error) {
      console.warn("API maintenance indisponible, utilisation des mockups.");
      return MOCK_MAINTENANCE_TASKS;
    }
  }
}

// Exporter une instance singleton du service
export const maintenanceService = new MaintenanceService()
