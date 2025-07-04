"use client";

import { WaterSourceList } from "@/components/water-resources/water-source-list";
import { WaterSourceCreateModal } from "@/components/water-resources/water-source-create-modal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, AlertTriangle, PlusCircle } from "lucide-react";
import { useState } from "react";

export default function WaterResourcesPage() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center gap-3">
            <Droplets className="w-7 h-7 text-blue-500" /> Ressources en eau
          </h1>
          <p className="mt-2 text-base text-muted-foreground font-medium">
            Gestion et suivi des ressources hydriques de l'exploitation
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-semibold shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setOpenCreate(true)}
          aria-label="Ajouter une source d'eau"
        >
          <PlusCircle className="w-5 h-5" /> Nouvelle source
        </button>
      </div>
      {/* Section Vue d'ensemble */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Droplets className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">actives</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Droplets className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Volume total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12 500L</div>
            <div className="text-sm text-muted-foreground">disponibles</div>
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
      {/* Liste des sources d'eau */}
      <section>
        <h2 className="text-xl font-bold mb-4">Sources d'eau</h2>
        <WaterSourceList />
      </section>
      <WaterSourceCreateModal open={openCreate} onOpenChange={setOpenCreate} />
    </div>
  );
}
