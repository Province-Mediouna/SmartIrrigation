"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle, AlertTriangle } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center gap-3">
            <FileText className="w-7 h-7 text-blue-700" /> Rapports
          </h1>
          <p className="mt-2 text-base text-muted-foreground font-medium">
            Générez et téléchargez les rapports de votre exploitation
          </p>
        </div>
      </div>
      {/* Section Vue d'ensemble */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <FileText className="w-6 h-6 text-blue-700 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Rapports générés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <div className="text-sm text-muted-foreground">ce mois</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Download className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Téléchargements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32</div>
            <div className="text-sm text-muted-foreground">ce mois</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CheckCircle className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Rapports valides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">13</div>
            <div className="text-sm text-muted-foreground">ce mois</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertTriangle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Erreurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">ce mois</div>
          </CardContent>
        </Card>
      </section>
      {/* Section liste des rapports (à compléter selon besoins) */}
      <section>
        <h2 className="text-xl font-bold mb-4">Liste des rapports</h2>
        {/* À compléter : liste ou table des rapports générés */}
        <div className="text-muted-foreground">
          (À venir : affichage détaillé des rapports générés)
        </div>
      </section>
    </div>
  );
}
