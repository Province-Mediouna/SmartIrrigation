"use client"

import { useState } from "react"
import { useIoTDevices } from "@/hooks/use-iot"
import type { DeviceType } from "@/types/iot"
import { Button } from "@/components/ui/button"

interface DeviceControlProps {
  deviceId: string
  deviceType: DeviceType
}

export default function DeviceControl({ deviceId, deviceType }: DeviceControlProps) {
  const { sendCommand } = useIoTDevices()
  const [command, setCommand] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    const ok = await sendCommand(deviceId, { command })
    setResult(ok ? "Commande envoyée avec succès" : "Erreur lors de l'envoi")
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Contrôle du dispositif ({deviceType})</h3>
      <input
        className="border px-2 py-1 rounded"
        placeholder="Commande personnalisée"
        value={command}
        onChange={e => setCommand(e.target.value)}
      />
      <Button onClick={handleSend} disabled={loading || !command}>
        {loading ? "Envoi..." : "Envoyer"}
      </Button>
      {result && <div className="text-sm text-gray-600">{result}</div>}
    </div>
  )
} 