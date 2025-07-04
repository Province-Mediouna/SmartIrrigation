import { Alert } from "@/types/alert";

export const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    type: "irrigation",
    message: "Niveau d'eau bas détecté dans la parcelle 3.",
    severity: "warning",
    date: new Date().toISOString(),
    resolved: false,
  },
  {
    id: "2",
    type: "capteur",
    message: "Capteur de température hors service.",
    severity: "critical",
    date: new Date(Date.now() - 3600 * 1000).toISOString(),
    resolved: false,
  },
  {
    id: "3",
    type: "général",
    message: "Mise à jour logicielle disponible pour la station 5.",
    severity: "info",
    date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    resolved: true,
  },
]; 