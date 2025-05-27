"use client"

import { useState } from "react"
import { useEvents } from "@/hooks/use-events"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { DateRangePicker } from "@/components/ui/date-range-picker" // À activer si disponible
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const SEVERITIES = ["info", "warning", "error", "critical"]

export default function EventLog() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(20)
  const [type, setType] = useState<string>("")
  const [severity, setSeverity] = useState<string>("")
  // const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null)

  const { events, loading, error, totalCount, markAsRead, deleteEvent } = useEvents({
    type: type || undefined,
    severity: severity || undefined,
    page,
    size,
    // startDate: dateRange?.start,
    // endDate: dateRange?.end,
  })

  function getBadgeVariant(severity: string) {
    switch (severity) {
      case "info": return "default"
      case "warning": return "secondary"
      case "error": return "destructive"
      case "critical": return "destructive"
      default: return "default"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Journal des événements</h2>
      <div className="flex gap-2 items-end">
        <input
          className="border px-2 py-1 rounded"
          placeholder="Type d'événement"
          value={type}
          onChange={e => setType(e.target.value)}
        />
        <select
          className="border px-2 py-1 rounded"
          value={severity}
          onChange={e => setSeverity(e.target.value)}
        >
          <option value="">Toutes sévérités</option>
          {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {/* <DateRangePicker value={dateRange} onChange={setDateRange} /> */}
      </div>
      {loading ? <div>Chargement...</div> : error ? <div className="text-red-500">Erreur: {error.message}</div> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sévérité</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map(event => (
              <TableRow key={event.id} className={event.read ? "" : "bg-blue-50"}>
                <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                <TableCell>{event.type}</TableCell>
                <TableCell><Badge variant={getBadgeVariant(event.severity)}>{event.severity}</Badge></TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => markAsRead(event.id)}>Lu</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteEvent(event.id)}>Supprimer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex gap-2 items-center mt-4">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Précédent</Button>
        <span>Page {page}</span>
        <Button onClick={() => setPage(p => p + 1)} disabled={events.length < size}>Suivant</Button>
        <span>Total: {totalCount}</span>
      </div>
    </div>
  )
} 