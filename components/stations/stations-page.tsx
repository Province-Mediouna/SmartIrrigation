"use client";

import { useState } from "react";
import { StationList } from "@/components/stations/station-list";
import { StationDetails } from "@/components/stations/station-details";
import { FirmwareUpdateModal } from "@/components/stations/firmware-update-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStations } from "@/hooks/use-stations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeatherWidget } from "@/components/weather/weather-widget";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TelemetryHealth } from "@/components/telemetry/telemetry-health";
import { MetricChart } from "@/components/telemetry/metric-chart";
import { StationCreateModal } from "@/components/stations/station-create-modal";
import dynamic from "next/dynamic";

const StationsMap = dynamic(() => import("./stations-map"), { ssr: false });

export default function StationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    null
  );
  const [showFirmwareModal, setShowFirmwareModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // On récupère les stations avec pagination, filtrage, recherche
  const {
    data: stations,
    isLoading,
    total,
  } = useStations({ page, size: 10, status, search });
  const selectedStation =
    stations?.find((station) => station.id === selectedStationId) || null;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <StationsMap />
      </div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stations météo</h1>
          <p className="text-muted-foreground">
            Gestion et surveillance des stations
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher une station..."
            className="input input-bordered"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            title="Statut"
            className="input input-bordered"
            value={status || ""}
            onChange={(e) => {
              setStatus(e.target.value || undefined);
              setPage(1);
            }}
          >
            <option value="">Tous les statuts</option>
            <option value="online">En ligne</option>
            <option value="offline">Hors ligne</option>
            <option value="warning">Avertissement</option>
          </select>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une station
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Stations</CardTitle>
              <CardDescription>
                Sélectionnez une station pour voir les détails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StationList
                page={page}
                size={10}
                status={status}
                search={search}
                onSelectStation={setSelectedStationId}
                selectedStationId={selectedStationId}
                onPageChange={setPage}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedStationId ? (
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="telemetry">Télémétrie</TabsTrigger>
                <TabsTrigger value="weather">Météo</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                {selectedStation && (
                  <StationDetails
                    station={selectedStation}
                    onUpdateFirmware={() => setShowFirmwareModal(true)}
                  />
                )}
              </TabsContent>

              <TabsContent value="telemetry">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <TelemetryHealth stationId={selectedStationId} />
                  <MetricChart
                    stationId={selectedStationId}
                    metric="temperature"
                  />
                  <MetricChart
                    stationId={selectedStationId}
                    metric="humidity"
                  />
                  <MetricChart stationId={selectedStationId} metric="battery" />
                </div>
              </TabsContent>

              <TabsContent value="weather">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <WeatherWidget stationId={selectedStationId} />
                  <Card>
                    <CardHeader>
                      <CardTitle>Prévisions avancées</CardTitle>
                      <CardDescription>
                        Prévisions météorologiques détaillées
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Données de prévisions avancées pour la station
                          sélectionnée.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex h-40 flex-col items-center justify-center">
                <p className="text-muted-foreground">
                  Sélectionnez une station pour voir les détails
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showFirmwareModal && selectedStation && (
        <FirmwareUpdateModal
          station={selectedStation}
          open={showFirmwareModal}
          onClose={() => setShowFirmwareModal(false)}
        />
      )}

      <StationCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
