"use client";

import { AlertList } from "@/components/alerts/alert-list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, CheckCircle, PlusCircle } from "lucide-react";
import { useState } from "react";

export default function AlertsPage() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-red-500" /> Alertes
          </h1>
          <p className="mt-2 text-base text-muted-foreground font-medium">Suivi et gestion des alertes du système</p>
        </div>
      </div>
      {/* Section Vue d'ensemble */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertTriangle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">en cours</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Bell className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Moyennes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">en cours</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CheckCircle className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Résolues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">ce mois</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <PlusCircle className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">alertes</div>
          </CardContent>
        </Card>
      </section>
      {/* Liste des alertes */}
      <section>
        <h2 className="text-xl font-bold mb-4">Liste des alertes</h2>
        <AlertList />
      </section>
    </div>
  );
}
