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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
} from "recharts";

interface WeatherPatternChartProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export function WeatherPatternChart({ dateRange }: WeatherPatternChartProps) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [view, setView] = useState<
    "temperature" | "precipitation" | "combined"
  >("combined");

  useEffect(() => {
    const fetchWeatherPatternData = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would call the API
        // const params = new URLSearchParams();
        // if (dateRange.from) params.append("startDate", dateRange.from.toISOString());
        // if (dateRange.to) params.append("endDate", dateRange.to.toISOString());
        // const response = await apiService.get(`/weather/patterns?${params.toString()}`);
        // setData(response);

        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate mock data for the last 30 days
        const mockData = [];
        const now = new Date();

        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);

          // Temperature follows a sine wave pattern with some randomness
          const avgTemp = 22 + Math.sin(i / 15) * 8 + (Math.random() - 0.5) * 2;

          mockData.push({
            date: date.toISOString().split("T")[0],
            minTemp: Math.round((avgTemp - 5 - Math.random() * 2) * 10) / 10,
            maxTemp: Math.round((avgTemp + 5 + Math.random() * 2) * 10) / 10,
            avgTemp: Math.round(avgTemp * 10) / 10,
            precipitation:
              Math.round(Math.random() * 20 * (1 + Math.sin(i / 10)) * 10) / 10,
            humidity: Math.round(
              50 + Math.sin(i / 8) * 20 + Math.random() * 10
            ),
            et0:
              Math.round(
                (4 + Math.sin(i / 12) * 2 + Math.random() * 0.5) * 10
              ) / 10,
          });
        }

        setData(mockData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch weather pattern data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherPatternData();
  }, [dateRange]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Motifs climatiques</CardTitle>
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
          <CardTitle>Motifs climatiques</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger les données climatiques. Veuillez réessayer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Motifs climatiques</CardTitle>
        <CardDescription>
          Analyse des tendances météorologiques et de leur impact sur
          l'irrigation
        </CardDescription>
        <Tabs
          value={view}
          onValueChange={(v) =>
            setView(v as "temperature" | "precipitation" | "combined")
          }
        >
          <TabsList>
            <TabsTrigger value="combined">Vue combinée</TabsTrigger>
            <TabsTrigger value="temperature">Température</TabsTrigger>
            <TabsTrigger value="precipitation">Précipitations</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {view === "temperature" ? (
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip formatter={(value) => [`${value}°C`, ""]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="maxTemp"
                  name="Temp. max"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avgTemp"
                  name="Temp. moyenne"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="minTemp"
                  name="Temp. min"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : view === "precipitation" ? (
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="precipitation"
                  name="Précipitations (mm)"
                  fill="#3b82f6"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  name="Humidité (%)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </ComposedChart>
            ) : (
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="precipitation"
                  name="Précipitations (mm)"
                  fill="#3b82f6"
                  stroke="#3b82f6"
                  fillOpacity={0.3}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgTemp"
                  name="Temp. moyenne (°C)"
                  stroke="#f97316"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="et0"
                  name="ET0 (mm)"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
