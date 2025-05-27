"use client"

import { useState } from "react"
import { useEventSubscriptions } from "@/hooks/use-events"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const EVENT_TYPES = ["ALERT", "DEVICE", "MAINTENANCE", "IRRIGATION", "SYSTEM"]
const SEVERITIES = ["info", "warning", "error", "critical"]
const CHANNELS = ["email", "sms", "push", "in_app"]

export default function SubscriptionForm() {
  const { subscribe, loading } = useEventSubscriptions()
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["in_app"])
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await subscribe({
      userId: "demo-user", // À remplacer par l'ID réel de l'utilisateur
      channels: selectedChannels as any,
      filters: {
        types: selectedTypes,
        severities: selectedSeverities as any,
      },
    })
    setResult(ok ? "Abonnement réussi" : "Erreur lors de l'abonnement")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Abonnement aux événements</h2>
      <div>
        <div className="font-semibold mb-1">Types d'événements :</div>
        <div className="flex gap-2 flex-wrap">
          {EVENT_TYPES.map(type => (
            <label key={type} className="flex items-center gap-1">
              <Checkbox checked={selectedTypes.includes(type)} onCheckedChange={v => setSelectedTypes(arr => v ? [...arr, type] : arr.filter(t => t !== type))} />
              {type}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="font-semibold mb-1">Sévérités :</div>
        <div className="flex gap-2 flex-wrap">
          {SEVERITIES.map(sev => (
            <label key={sev} className="flex items-center gap-1">
              <Checkbox checked={selectedSeverities.includes(sev)} onCheckedChange={v => setSelectedSeverities(arr => v ? [...arr, sev] : arr.filter(s => s !== sev))} />
              {sev}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="font-semibold mb-1">Canaux :</div>
        <div className="flex gap-2 flex-wrap">
          {CHANNELS.map(ch => (
            <label key={ch} className="flex items-center gap-1">
              <Checkbox checked={selectedChannels.includes(ch)} onCheckedChange={v => setSelectedChannels(arr => v ? [...arr, ch] : arr.filter(c => c !== ch))} />
              {ch}
            </label>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={loading}>S'abonner</Button>
      {result && <div className="text-sm text-gray-600">{result}</div>}
    </form>
  )
} 