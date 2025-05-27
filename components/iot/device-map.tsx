"use client"

import type { IoTDevice } from "@/types/iot"

interface DeviceMapProps {
  devices: IoTDevice[]
}

export default function DeviceMap({ devices }: DeviceMapProps) {
  // Placeholder: à remplacer par une vraie carte (Leaflet, Mapbox, etc.)
  return (
    <div className="border rounded p-4 mt-4">
      <h4 className="font-semibold mb-2">Carte des dispositifs (démo)</h4>
      <ul className="text-sm">
        {devices.map(d => (
          <li key={d.id}>
            {d.name} ({d.type}) - {d.location ? `${d.location.latitude}, ${d.location.longitude}` : "Pas de localisation"}
          </li>
        ))}
      </ul>
    </div>
  )
} 