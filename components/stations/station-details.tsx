"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Upload, MapPin, Calendar, Thermometer, Droplets } from "lucide-react"
import type { Station } from "@/types/station"

interface StationDetailsProps {
  station: Station
  onUpdateFirmware: () => void
}

export function StationDetails({ station, onUpdateFirmware }: StationDetailsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "offline":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            En ligne
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
            Hors ligne
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
            Avertissement
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              {getStatusIcon(station.status)}
            </div>
            <div>
              <CardTitle>{station.name}</CardTitle>
              <CardDescription>ID: {station.id}</CardDescription>
            </div>
          </div>
          <div>{getStatusBadge(station.status)}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Localisation
            </div>
            <p className="text-sm">Latitude: 33.5731° N</p>
            <p className="text-sm">Longitude: 7.5898° W</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Dernière mise à jour
            </div>
            <p className="text-sm">{formatDate(station.lastUpdate)}</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              Capteurs
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Température</div>
              <div>Actif</div>
              <div>Humidité</div>
              <div>Actif</div>
              <div>Vent</div>
              <div>Actif</div>
              <div>Pluviométrie</div>
              <div>Actif</div>
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              Batterie
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${
                    station.batteryLevel > 60
                      ? "bg-green-500"
                      : station.batteryLevel > 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${station.batteryLevel}%` }}
                />
              </div>
              <span className="text-sm font-medium">{station.batteryLevel}%</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Upload className="h-4 w-4 text-muted-foreground" />
              Firmware
            </div>
            <Badge variant="outline">v{station.firmwareVersion}</Badge>
          </div>
          <p className="mb-2 text-sm text-muted-foreground">
            La dernière version du firmware apporte des améliorations de performance et de sécurité.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Calibrer les capteurs</Button>
        <Button onClick={onUpdateFirmware}>Mettre à jour le firmware</Button>
      </CardFooter>
    </Card>
  )
}
