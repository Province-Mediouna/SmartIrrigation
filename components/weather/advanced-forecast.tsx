"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { weatherService } from "@/services/weather-service"

const MODEL_TYPES = ["ENSEMBLE", "STATISTICAL", "ML"]

export default function AdvancedForecast({ stationId }: { stationId: string }) {
  const [modelType, setModelType] = useState("ENSEMBLE")

  const { data, isLoading } = useQuery({
    queryKey: ["weatherForecast", stationId, modelType],
    queryFn: () => weatherService.getForecast({ stationId, modelType }),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prévisions avancées</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center mb-4">
          <span>Modèle :</span>
          <Select value={modelType} onValueChange={setModelType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type de modèle" />
            </SelectTrigger>
            <SelectContent>
              {MODEL_TYPES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {isLoading ? <div>Chargement...</div> : data && Array.isArray(data) ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Température" />
              <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidité" />
              <Line type="monotone" dataKey="precipitation" stroke="#00bcd4" name="Précipitations" />
            </LineChart>
          </ResponsiveContainer>
        ) : <div>Aucune donnée</div>}
      </CardContent>
    </Card>
  )
} 