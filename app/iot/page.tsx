"use client";

import DeviceList from "@/components/iot/device-list";
import DeviceControl from "@/components/iot/device-control";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Zap, AlertTriangle, PlusCircle } from "lucide-react";
import { useState } from "react";

export default function IoTPage() {
  const [selectedDevice, setSelectedDevice] = useState(null);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center gap-3">
            <Wifi className="w-7 h-7 text-green-500" /> IoT
          </h1>
          <p className="mt-2 text-base text-muted-foreground font-medium">
            Gestion et contrôle des objets connectés de l'exploitation
          </p>
        </div>
      </div>
      {/* Section Vue d'ensemble */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Wifi className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Objets connectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">actifs</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Zap className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Automatisations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">6</div>
            <div className="text-sm text-muted-foreground">en service</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertTriangle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
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
            <div className="text-3xl font-bold">26/06</div>
            <div className="text-sm text-muted-foreground">données</div>
          </CardContent>
        </Card>
      </section>
      {/* Liste et contrôle des objets connectés */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-xl transition-shadow focus-within:ring-2 focus-within:ring-primary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Liste des objets connectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeviceList onSelect={setSelectedDevice} />
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-xl transition-shadow focus-within:ring-2 focus-within:ring-primary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Contrôle de l'objet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeviceControl device={selectedDevice} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
