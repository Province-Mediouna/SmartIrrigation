import { MaintenanceTask } from "@/types/maintenance";

export const MOCK_MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: "1",
    title: "Vérification pompe principale",
    status: "en cours",
    scheduledDate: new Date().toISOString(),
    assignedTo: "Technicien A",
    // ... autres champs nécessaires
  },
  {
    id: "2",
    title: "Nettoyage capteurs",
    status: "planifié",
    scheduledDate: new Date(Date.now() + 2 * 86400 * 1000).toISOString(),
    assignedTo: "Technicien B",
    // ... autres champs nécessaires
  },
]; 