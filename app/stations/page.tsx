"use client";

import { StationList } from "@/components/stations/station-list";
import { StationCreateModal } from "@/components/stations/station-create-modal";
import { FirmwareUpdateModal } from "@/components/stations/firmware-update-modal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Wifi, AlertTriangle, PlusCircle } from "lucide-react";
import { useState } from "react";
import type { Station } from "@/types/station";

export default function StationsPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openFirmware, setOpenFirmware] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | undefined>(
    undefined
  );

  const handleFirmwareUpdate = () => {
    // Pour l'exemple, on utilise une station fictive
    // En réalité, cela devrait être la station sélectionnée par l'utilisateur
    const mockStation: Station = {
      id: "1",
      name: "Station Principale",
      location: "Champ Nord",
      status: "active",
      firmwareVersion: "2.3.1",
      lastSeen: new Date().toISOString(),
      coordinates: { lat: 48.8566, lng: 2.3522 },
      sensors: [],
      alerts: [],
    };
    setSelectedStation(mockStation);
    setOpenFirmware(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center gap-3">
            <Cloud className="w-7 h-7 text-sky-500" /> Stations météo
          </h1>
          <p className="mt-2 text-base text-muted-foreground font-medium">
            Gestion et suivi de vos stations météo connectées
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-semibold shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setOpenCreate(true)}
            aria-label="Ajouter une station"
          >
            <PlusCircle className="w-5 h-5" /> Nouvelle station
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-muted text-foreground px-4 py-2 font-semibold shadow hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={handleFirmwareUpdate}
            aria-label="Mise à jour firmware"
          >
            <Wifi className="w-5 h-5" /> MAJ firmware
          </button>
        </div>
      </div>
      {/* Section Vue d'ensemble */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Cloud className="w-6 h-6 text-sky-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Stations actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">/ 10</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Wifi className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Connectées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
            <div className="text-sm text-muted-foreground">en ligne</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertTriangle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">en cours</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <PlusCircle className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Dernière MAJ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">25/06</div>
            <div className="text-sm text-muted-foreground">firmware</div>
          </CardContent>
        </Card>
      </section>
      {/* Liste des stations */}
      <section>
        <h2 className="text-xl font-bold mb-4">Liste des stations</h2>
        <StationList />
      </section>
      <StationCreateModal open={openCreate} onOpenChange={setOpenCreate} />
      <FirmwareUpdateModal
        station={selectedStation}
        open={openFirmware}
        onClose={() => {
          setOpenFirmware(false);
          setSelectedStation(undefined);
        }}
      />
    </div>
  );
}
