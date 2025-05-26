"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, AlertTriangle } from "lucide-react"
import { waterResourcesService } from "@/services/water-resources-service"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface WaterLevelChartProps {
  sourceId: string
}

interface WaterLevel {
  date: string
  level: number
}

export function WaterLevelChart({ sourceId }: WaterLevelChartProps) {
  const { toast } = useToast()
  const [waterLevels, setWaterLevels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })

  useEffect(() => {
    const fetchWaterLevels = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await waterResourcesService.getWaterLevels(sourceId, dateRange.from, dateRange.to)
        setWaterLevels(data)
      } catch (err) {
        console.error("Failed to fetch water levels:", err)
        setError("Impossible de charger les niveaux d'eau")
        toast({
          title: "Erreur",
          description: "Impossible de charger les niveaux d'eau",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (sourceId) {
      fetchWaterLevels()
    }
  }, [sourceId, dateRange, toast])

  // Préparation des données pour le graphique
  const chartData = waterLevels.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    level: item.level,
  }))

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Niveaux d'eau</CardTitle>
          <Skeleton className="h-9 w-[180px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Niveaux d'eau</CardTitle>
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border border-destructive/50 p-8">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="mb-2 h-10 w-10 text-destructive" />
              <h3 className="text-lg font-semibold">Erreur de chargement</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (waterLevels.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Niveaux d'eau</CardTitle>
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border p-8">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold">Aucune donnée disponible</h3>
              <p className="text-sm text-muted-foreground">
                Aucune donnée de niveau d'eau n'a été enregistrée pour cette source dans la période sélectionnée.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Niveaux d'eau</CardTitle>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{
                  value: "Niveau (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
                domain={[0, 100]}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="level"
                name="Niveau d'eau"
                stroke="#2563eb"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface DateRangePickerProps {
  dateRange: {
    from: Date
    to: Date
  }
  setDateRange: React.Dispatch<
    React.SetStateAction<{
      from: Date
      to: Date
    }>
  >
}

function DateRangePicker({ dateRange, setDateRange }: DateRangePickerProps) {
  const [date, setDate] = useState<{
    from: Date
    to: Date
  }>(dateRange)

  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (selectedDate: any) => {
    setDate(selectedDate)
    if (selectedDate.from && selectedDate.to) {
      setDateRange(selectedDate)
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date.from ? (
            date.to ? (
              <>
                {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(date.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Sélectionner une période</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          defaultMonth={date.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  )
}
