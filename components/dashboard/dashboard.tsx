"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { WeatherWidget } from "@/components/weather/weather-widget";
import { StationList } from "@/components/stations/station-list";
import { AlertList } from "@/components/alerts/alert-list";
import { IrrigationZoneList } from "@/components/irrigation/irrigation-zone-list";
import { TelemetryHealth } from "@/components/telemetry/telemetry-health";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loader2, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  AlertTriangle,
  Droplets,
  Cloud,
  Leaf,
  Zap,
  Thermometer,
  Gauge,
} from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // 🔁 Redirection proprement faite via useEffect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // ⏳ Affichage d'un loader si auth en cours
  if (isLoading || (!isAuthenticated && typeof window !== "undefined")) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="text-center space-y-4">
          <Loader2
            className="h-16 w-16 animate-spin text-primary mx-auto"
            aria-label="Chargement..."
          />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Chargement en cours...
            </h2>
            <p className="text-muted-foreground">
              Initialisation de votre tableau de bord
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 👇 Si on n'est pas encore authentifié, on ne rend rien (en attendant redirection)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 lg:pl-64">
      {/* Sidebar responsive */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête du dashboard */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm flex items-center gap-3">
                  <BarChart3 className="w-10 h-10 text-primary" />
                  Tableau de bord
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  Vue d'ensemble de votre exploitation intelligente
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2 text-sm font-medium"
                  aria-label="Statut système OK"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Système opérationnel
                </Badge>
              </div>
            </div>
          </div>

          {/* Section Vue d'ensemble - Métriques principales */}
          <section className="mb-10 animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Métriques principales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 group hover hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Cloud className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    Stations météo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground">
                        8
                      </div>
                      <div className="text-sm text-muted-foreground">
                        actives
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 group hover hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/20">
                    <Droplets className="w-6 h-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    Zones d'irrigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground">
                        12
                      </div>
                      <div className="text-sm text-muted-foreground">
                        programmées
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 group hover hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    Alertes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground">
                        4
                      </div>
                      <div className="text-sm text-muted-foreground">
                        actives
                      </div>
                    </div>
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 group hover hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Gauge className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    Efficacité globale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground">
                        96%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        performance
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section widgets principaux */}
          <section className="mb-10 animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Vue d'ensemble en temps réel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-500" />
                    Météo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WeatherWidget />
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-green-500" />
                    Santé télémétrique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TelemetryHealth />
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover hover:-translate-y-1 md:col-span-2 xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Alertes récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AlertList />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section stations/irrigation */}
          <section className="animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Gestion des équipements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-500" />
                    Stations météo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StationList />
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-cyan-500" />
                    Zones d'irrigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <IrrigationZoneList />
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
