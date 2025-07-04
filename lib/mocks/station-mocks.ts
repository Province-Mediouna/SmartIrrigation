import { Station } from "@/types/station";

export const MOCK_STATIONS: Station[] = [
  {
    id: "1",
    name: "Station météo Nord",
    status: "online",
    location: "Nord",
    lastUpdate: new Date().toISOString(),
    // ... autres champs nécessaires
  },
  {
    id: "2",
    name: "Station météo Sud",
    status: "offline",
    location: "Sud",
    lastUpdate: new Date(Date.now() - 3600 * 1000).toISOString(),
    // ... autres champs nécessaires
  },
]; 