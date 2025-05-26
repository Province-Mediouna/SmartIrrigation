"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, Droplets, Clock, CalendarIcon } from "lucide-react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

export function IrrigationHistory() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [zoneFilter, setZoneFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("week")

  // Mock data for charts
  const dailyData = [
    { name: "Lun", volume: 120 },
    { name: "Mar", volume: 150 },
    { name: "Mer", volume: 80 },
    { name: "Jeu", volume: 100 },
    { name: "Ven", volume: 130 },
    { name: "Sam", volume: 90 },
    { name: "Dim", volume: 70 },
  ]

  const hourlyData = [
    { time: "06:00", volume: 40 },
    { time: "08:00", volume: 0 },
    { time: "10:00", volume: 0 },
    { time: "12:00", volume: 0 },
    { time: "14:00", volume: 0 },
    { time: "16:00", volume: 0 },
    { time: "18:00", volume: 50 },
    { time: "20:00", volume: 30 },
    { time: "22:00", volume: 0 },
  ]

  const zoneData = [
    { name: "Zone Nord", value: 120 },
    { name: "Zone Sud", value: 150 },
    { name: "Zone Est", value: 80 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historique d'irrigation</CardTitle>
          <CardDescription>Consultez l'historique de consommation d'eau</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Période:</span>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Jour</SelectItem>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="year">Année</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Zone:</span>
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les zones</SelectItem>
                  <SelectItem value="1">Zone Nord - Tomates</SelectItem>
                  <SelectItem value="2">Zone Sud - Concombres</SelectItem>
                  <SelectItem value="3">Zone Est - Laitues</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="bar">
            <TabsList className="mb-4">
              <TabsTrigger value="bar" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Consommation
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Tendance
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Répartition
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bar">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} L`, "Volume"]} />
                    <Legend />
                    <Bar dataKey="volume" name="Volume d'eau (L)" fill="#3b82f6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="line">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} L`, "Volume"]} />
                    <Legend />
                    <Line type="monotone" dataKey="volume" name="Volume d'eau (L)" stroke="#3b82f6" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="pie">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={zoneData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {zoneData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} L`, "Volume"]} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journal d'irrigation</CardTitle>
          <CardDescription>Événements d'irrigation récents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Droplets className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">
                      Zone {i === 1 ? "Nord" : i === 2 ? "Sud" : "Est"} - Irrigation{" "}
                      {i === 1 ? "terminée" : "programmée"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {i === 1 ? "Aujourd'hui" : i === 2 ? "Demain" : "Dans 2 jours"} à {6 + i}:00 -{" "}
                      {i === 1 ? "40L utilisés" : "Durée estimée: 30min"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {i === 1 ? "Il y a 2h" : i === 2 ? "Programmé" : "Programmé"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
