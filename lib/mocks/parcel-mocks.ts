import { Parcel } from "@/types/parcel";

export const MOCK_PARCELS: Parcel[] = [
  {
    id: "1",
    name: "Parcelle A",
    area: 2.5,
    crop: "Blé",
    status: "cultivé",
    lastIrrigation: new Date().toISOString(),
    // ... autres champs nécessaires
  },
  {
    id: "2",
    name: "Parcelle B",
    area: 1.8,
    crop: "Maïs",
    status: "en jachère",
    lastIrrigation: new Date(Date.now() - 86400 * 1000).toISOString(),
    // ... autres champs nécessaires
  },
];
