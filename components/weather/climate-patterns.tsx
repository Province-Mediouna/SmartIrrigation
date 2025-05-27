"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { weatherService } from "@/services/weather-service"

const PERIODS = ["DAILY", "WEEKLY", "MONTHLY", "SEASONAL"]

export default function ClimatePatterns() {
  const [period, setPeriod] = useState("MONTHLY")

  const { data, isLoading } = useQuery({
    queryKey: ["weatherPatterns", period],
    queryFn: () => weatherService.getWeatherPatterns(period),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Motifs climatiques</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center mb-4">
          <span>Période :</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {isLoading ? <div>Chargement...</div> : data && Array.isArray(data) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgTemp" stroke="#8884d8" name="Temp. moyenne" />
                <Line type="monotone" dataKey="precipitation" stroke="#00bcd4" name="Précipitations" />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="humidity" stroke="#82ca9d" fill="#82ca9d33" name="Humidité" />
                <Area type="monotone" dataKey="et0" stroke="#ff9800" fill="#ff980033" name="ET0" />
              </AreaChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minTemp" fill="#2196f3" name="Temp. min" />
                <Bar dataKey="maxTemp" fill="#f44336" name="Temp. max" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <div>Aucune donnée</div>}
      </CardContent>
    </Card>
  )
} 