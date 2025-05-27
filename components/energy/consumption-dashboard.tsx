"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { energyService } from "@/services/energy-service"

const SYSTEM_TYPES = ["IRRIGATION", "VERTICAL", "GREENHOUSE", "AQUAPONICS"]
const PERIODS = ["day", "week", "month", "year"]
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00bcd4"]

export default function ConsumptionDashboard() {
  const [systemType, setSystemType] = useState("")
  const [period, setPeriod] = useState("month")

  const { data, isLoading } = useQuery({
    queryKey: ["energyConsumption", systemType, period],
    queryFn: () => energyService.getEnergyConsumption(systemType),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consommation énergétique</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center mb-4">
          <span>Système :</span>
          <Select value={systemType} onValueChange={setSystemType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type de système" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              {SYSTEM_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <span>Période :</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
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
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consumption" stroke="#8884d8" name="Consommation (kWh)" />
                <Line type="monotone" dataKey="cost" stroke="#ff7300" name="Coût" />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="systemType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumption" fill="#82ca9d" name="Consommation (kWh)" />
                <Bar dataKey="cost" fill="#ffc658" name="Coût" />
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data} dataKey="consumption" nameKey="systemType" cx="50%" cy="50%" outerRadius={80} label>
                  {data.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : <div>Aucune donnée</div>}
      </CardContent>
    </Card>
  )
} 