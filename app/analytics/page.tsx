"use client";

import AnalyticsWidgets from "@/components/analytics/analytics-page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Droplets, Leaf } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-purple-600" /> Analytics
          </h1>
          <p className="mt-2 text-base text-muted-foreground font-medium">
            Analyse avancée des performances et de l'utilisation des ressources
          </p>
        </div>
      </div>
      {/* Section Vue d'ensemble */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <TrendingUp className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Rendement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+12%</div>
            <div className="text-sm text-muted-foreground">ce mois</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Droplets className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Eau utilisée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8 200L</div>
            <div className="text-sm text-muted-foreground">ce mois</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Leaf className="w-6 h-6 text-lime-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">Cultures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">9</div>
            <div className="text-sm text-muted-foreground">en cours</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow group focus-within:ring-2 focus-within:ring-primary">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BarChart3 className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-base font-semibold">
              Efficacité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">96%</div>
            <div className="text-sm text-muted-foreground">système</div>
          </CardContent>
        </Card>
      </section>
      {/* Widgets analytiques */}
      <section>
        <AnalyticsWidgets />
      </section>
    </div>
  );
}
