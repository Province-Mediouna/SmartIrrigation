"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Crop } from "@/types/crop";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface CropPerformanceProps {
  crops: Crop[];
}

export function CropPerformance({ crops }: CropPerformanceProps) {
  const activeCrops = crops.filter(
    (crop) => crop.status === "active" || crop.status === "harvested"
  );

  const performanceData = activeCrops.map((crop) => ({
    name: crop.name,
    rendement: crop.yield || 0,
    eau: crop.waterRequirement,
    efficacite: crop.yield ? (crop.yield / crop.waterRequirement) * 1000 : 0, // kg/m³
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance des cultures</CardTitle>
        <CardDescription>Rendements et efficience hydrique</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="rendement"
                name="Rendement (t/ha)"
                fill="#3b82f6"
              />
              <Bar
                yAxisId="right"
                dataKey="efficacite"
                name="Efficience (kg/m³)"
                fill="#22c55e"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
