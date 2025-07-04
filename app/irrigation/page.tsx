"use client";

import { IrrigationZoneList } from "@/components/irrigation/irrigation-zone-list";
import { IrrigationScheduleManager } from "@/components/irrigation/irrigation-schedule-manager";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Calendar, AlertTriangle, PlusCircle } from "lucide-react";
import { useState } from "react";

export default function IrrigationPage() {
  const [openSchedule, setOpenSchedule] = useState(false);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center gap-3">
            <Droplets className="w-7 h-7 text-blue-500" /> Irrigation
          </h1>
          <p className="mt-2 text-base text-muted-foreground font-medium">
            Gestion intelligente de l’irrigation et des zones programmées
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-semibold shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setOpenSchedule(true)}
          aria-label="Programmer une irrigation"
        >
          <PlusCircle className="w-5 h-5" /> Programmer
        </button>
      </div>
      {/* Section Vue d'ensemble */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Droplets className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">programmées</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Prochaine irrigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">27/06</div>
            <div className="text-sm text-muted-foreground">à 06:00</div>
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
            <div className="text-3xl font-bold">26/06</div>
            <div className="text-sm text-muted-foreground">données</div>
          </CardContent>
        </Card>
      </section>
      {/* Liste des zones d'irrigation */}
      <section>
        <h2 className="text-xl font-bold mb-4">Zones d'irrigation</h2>
        <IrrigationZoneList />
      </section>
      <IrrigationScheduleManager
        open={openSchedule}
        onOpenChange={setOpenSchedule}
      />
    </div>
  );
}
