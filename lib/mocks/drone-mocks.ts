import { Drone } from "@/types/drone";

export const MOCK_DRONES: Drone[] = [
  {
    id: "1",
    name: "Drone Alpha",
    status: "en vol",
    battery: 85,
    lastMission: "Inspection parcelle A",
    // ... autres champs nécessaires
  },
  {
    id: "2",
    name: "Drone Beta",
    status: "en charge",
    battery: 40,
    lastMission: "Pulvérisation parcelle B",
    // ... autres champs nécessaires
  },
]; 