"use client"

import { useState } from "react"
import { useIoTDevices } from "@/hooks/use-iot"
import type { IoTDevice, DeviceType } from "@/types/iot"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import DeviceMap from "./device-map"

const DEVICE_TYPES: DeviceType[] = ["SENSOR", "ACTUATOR", "CONTROLLER", "GATEWAY"]

export default function DeviceList() {
  const { devices, loading, error, createDevice, deleteDevice, sendCommand, refreshDevices } = useIoTDevices()
  const [newDevice, setNewDevice] = useState<Partial<IoTDevice>>({ type: "SENSOR" })
  const [command, setCommand] = useState("")
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    await createDevice(newDevice)
    setNewDevice({ type: "SENSOR" })
  }

  const handleDelete = async (id: string) => {
    await deleteDevice(id)
  }

  const handleSendCommand = async () => {
    if (selectedDevice && command) {
      await sendCommand(selectedDevice, { command })
      setCommand("")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dispositifs IoT</h2>
      <form onSubmit={handleAddDevice} className="flex gap-2 items-end">
        <input
          className="border px-2 py-1 rounded"
          placeholder="Nom du dispositif"
          value={newDevice.name || ""}
          onChange={e => setNewDevice(d => ({ ...d, name: e.target.value }))}
          required
        />
        <select
          className="border px-2 py-1 rounded"
          value={newDevice.type}
          onChange={e => setNewDevice(d => ({ ...d, type: e.target.value as DeviceType }))}
        >
          {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <Button type="submit">Ajouter</Button>
      </form>
      {loading ? <div>Chargement...</div> : error ? <div className="text-red-500">Erreur: {error.message}</div> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière comm.</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map(device => (
              <TableRow key={device.id}>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.status}</TableCell>
                <TableCell>{device.lastHeartbeat ? new Date(device.lastHeartbeat).toLocaleString() : "-"}</TableCell>
                <TableCell>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(device.id)}>Supprimer</Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedDevice(device.id)}>Commander</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedDevice && (
        <div className="flex gap-2 items-center mt-4">
          <input
            className="border px-2 py-1 rounded"
            placeholder="Commande à envoyer"
            value={command}
            onChange={e => setCommand(e.target.value)}
          />
          <Button onClick={handleSendCommand}>Envoyer</Button>
          <Button variant="ghost" onClick={() => setSelectedDevice(null)}>Annuler</Button>
        </div>
      )}
      <DeviceMap devices={devices} />
    </div>
  )
} 