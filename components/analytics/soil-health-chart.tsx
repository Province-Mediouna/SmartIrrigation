"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface SoilHealthChartProps {
  parcelId?: string;
}

export function SoilHealthChart({ parcelId }: SoilHealthChartProps) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [view, setView] = useState<"radar" | "nutrients">("radar");

  useEffect(() => {
    const fetchSoilHealthData = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would call the API
        // const params = new URLSearchParams();
        // if (parcelId) params.append("parcelId", parcelId);
        // const response = await apiService.get(`/analytics/soil-health?${params.toString()}`);
        // setData(response);

        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockData = {
          radarData: [
            { metric: "pH", value: 85, fullMark: 100 },
            { metric: "Matière organique", value: 65, fullMark: 100 },
            { metric: "Structure", value: 78, fullMark: 100 },
            { metric: "Biodiversité", value: 92, fullMark: 100 },
            { metric: "Rétention d'eau", value: 70, fullMark: 100 },
            { metric: "Activité microbienne", value: 88, fullMark: 100 },
          ],
          nutrientsData: [
            { name: "Azote (N)", current: 42, optimal: 50 },
            { name: "Phosphore (P)", current: 35, optimal: 40 },
            { name: "Potassium (K)", current: 58, optimal: 60 },
            { name: "Calcium (Ca)", current: 70, optimal: 65 },
            { name: "Magnésium (Mg)", current: 65, optimal: 55 },
            { name: "Soufre (S)", current: 30, optimal: 35 },
            { name: "Fer (Fe)", current: 45, optimal: 40 },
          ],
        };

        setData(mockData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch soil health data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSoilHealthData();
  }, [parcelId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Santé du sol</CardTitle>
          <div className="text-sm text-muted-foreground">
            <Skeleton className="h-4 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Santé du sol</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger les données de santé du sol. Veuillez
            réessayer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Santé du sol</CardTitle>
        <CardDescription>
          Analyse des indicateurs de santé et de fertilité du sol
        </CardDescription>
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "radar" | "nutrients")}
        >
          <TabsList>
            <TabsTrigger value="radar">Indicateurs globaux</TabsTrigger>
            <TabsTrigger value="nutrients">Nutriments</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {view === "radar" ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={data.radarData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Valeur actuelle"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.nutrientsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" name="Niveau actuel" fill="#3b82f6" />
                <Bar dataKey="optimal" name="Niveau optimal" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
