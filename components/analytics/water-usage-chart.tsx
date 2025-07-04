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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WaterUsageChartProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  parcelId?: string;
}

export function WaterUsageChart({ dateRange, parcelId }: WaterUsageChartProps) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    const fetchWaterUsageData = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would call the API
        // const params = new URLSearchParams();
        // if (dateRange.from) params.append("startDate", dateRange.from.toISOString());
        // if (dateRange.to) params.append("endDate", dateRange.to.toISOString());
        // if (parcelId) params.append("parcelId", parcelId);
        // params.append("interval", view);
        // const response = await apiService.get(`/analytics/water-usage?${params.toString()}`);
        // setData(response);

        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate mock data based on the view
        const mockData = [];
        const now = new Date();

        if (view === "daily") {
          // Last 14 days
          for (let i = 13; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            mockData.push({
              date: date.toISOString().split("T")[0],
              irrigation: Math.round(
                80 + Math.sin(i / 3) * 30 + Math.random() * 20
              ),
              rainfall: Math.round(Math.random() * 20),
            });
          }
        } else if (view === "weekly") {
          // Last 8 weeks
          for (let i = 7; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i * 7);
            mockData.push({
              date: `S${
                Math.floor(date.getDate() / 7) + 1
              } ${date.toLocaleString("fr-FR", { month: "short" })}`,
              irrigation: Math.round(
                500 + Math.sin(i / 2) * 200 + Math.random() * 100
              ),
              rainfall: Math.round(50 + Math.random() * 150),
            });
          }
        } else {
          // Last 12 months
          for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            mockData.push({
              date: date.toLocaleString("fr-FR", { month: "short" }),
              irrigation: Math.round(
                2000 + Math.sin(i / 6) * 1000 + Math.random() * 500
              ),
              rainfall: Math.round(
                200 + Math.cos(i / 3) * 300 + Math.random() * 200
              ),
            });
          }
        }

        setData(mockData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch water usage data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaterUsageData();
  }, [dateRange, parcelId, view]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Consommation d'eau</CardTitle>
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
          <CardTitle>Consommation d'eau</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger les données de consommation d'eau. Veuillez
            réessayer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consommation d'eau</CardTitle>
        <CardDescription>
          Analyse de la consommation d'eau par irrigation et apport
          pluviométrique
        </CardDescription>
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "daily" | "weekly" | "monthly")}
        >
          <TabsList>
            <TabsTrigger value="daily">Quotidien</TabsTrigger>
            <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} m³`, ""]} />
              <Legend />
              <Bar dataKey="irrigation" name="Irrigation" fill="#3b82f6" />
              <Bar dataKey="rainfall" name="Pluie" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
