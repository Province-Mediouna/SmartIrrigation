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
import { Loader2 } from "lucide-react";

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

  // ⏳ Affichage d’un loader si auth en cours
  if (isLoading || (!isAuthenticated && typeof window !== "undefined")) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 👇 Si on n'est pas encore authentifié, on ne rend rien (en attendant redirection)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Décale le contenu principal à droite de la sidebar sur desktop */}
      <div className="hidden lg:block lg:w-64" />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <h1 className="mb-6 text-3xl font-bold text-primary drop-shadow">Tableau de bord</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <WeatherWidget />
            <TelemetryHealth />
            <AlertList />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <StationList />
            <IrrigationZoneList />
          </div>
        </main>
      </div>
    </div>
  );
}
