import { WaterSource } from "@/types/water-resource";

export const MOCK_WATER_RESOURCES: WaterSource[] = [
  {
    id: "1",
    name: "Réservoir principal",
    type: "reservoir",
    location: { latitude: 33.58, longitude: -7.6 },
    capacity: 10000,
    currentLevel: 75,
    status: "active",
    lastUpdate: new Date().toISOString(),
    description: "Le réservoir principal qui alimente les parcelles Nord."
  },
  {
    id: "2",
    name: "Puits Sud",
    type: "well",
    location: { latitude: 33.57, longitude: -7.61 },
    capacity: 2000,
    currentLevel: 40,
    status: "maintenance",
    lastUpdate: new Date(Date.now() - 3600 * 1000).toISOString(),
    description: "Puits secondaire pour l'irrigation d'appoint."
  },
]; 