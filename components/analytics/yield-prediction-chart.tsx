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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface YieldPredictionChartProps {
  cropType?: string;
}

export function YieldPredictionChart({ cropType }: YieldPredictionChartProps) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchYieldPredictionData = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would call the API
        // const params = new URLSearchParams();
        // if (cropType) params.append("cropType", cropType);
        // const response = await apiService.get(`/analytics/predictions?${params.toString()}`);
        // setData(response);

        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate mock data
        const mockData = [];
        const now = new Date();
        const currentYear = now.getFullYear();

        // Historical data (past 3 years)
        for (let year = currentYear - 3; year < currentYear; year++) {
          mockData.push({
            year: year.toString(),
            actual: Math.round((6 + Math.random() * 4) * 10) / 10,
            predicted: null,
            lowerBound: null,
            upperBound: null,
          });
        }

        // Current year (partial actual + prediction)
        mockData.push({
          year: currentYear.toString(),
          actual: Math.round((7 + Math.random() * 3) * 10) / 10,
          predicted: Math.round((7.5 + Math.random() * 2) * 10) / 10,
          lowerBound: Math.round((6.5 + Math.random() * 1) * 10) / 10,
          upperBound: Math.round((8.5 + Math.random() * 1) * 10) / 10,
        });

        // Future predictions (next 2 years)
        for (let year = currentYear + 1; year <= currentYear + 2; year++) {
          const predicted = Math.round((7.8 + Math.random() * 3) * 10) / 10;
          mockData.push({
            year: year.toString(),
            actual: null,
            predicted: predicted,
            lowerBound:
              Math.round((predicted - 1 - Math.random() * 0.5) * 10) / 10,
            upperBound:
              Math.round((predicted + 1 + Math.random() * 0.5) * 10) / 10,
          });
        }

        setData(mockData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch yield prediction data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchYieldPredictionData();
  }, [cropType]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prédiction de rendement</CardTitle>
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
          <CardTitle>Prédiction de rendement</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger les données de prédiction de rendement.
            Veuillez réessayer.
          </p>
        </CardContent>
      </Card>
    );
  }

  const cropName =
    cropType === "tomatoes"
      ? "Tomates"
      : cropType === "corn"
      ? "Maïs"
      : cropType === "lettuce"
      ? "Laitue"
      : cropType === "potatoes"
      ? "Pommes de terre"
      : "Toutes cultures";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prédiction de rendement</CardTitle>
        <CardDescription>
          Analyse et prévision des rendements pour {cropName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                domain={[0, "dataMax + 2"]}
                label={{ value: "t/ha", angle: -90, position: "insideLeft" }}
              />
              <Tooltip formatter={(value) => [`${value} t/ha`, ""]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                name="Rendement réel"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="Rendement prédit"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="upperBound"
                name="Limite supérieure"
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="lowerBound"
                name="Limite inférieure"
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
