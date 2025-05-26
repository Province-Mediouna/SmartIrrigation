"use client"

import React from "react"
import { useAlertStats } from "@/hooks/use-alerts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DatePickerWithRange } from "@/components/shared/date-picker-with-range"
import { addDays } from "date-fns"
import { AlertTriangle, AlertCircle, CheckCircle, Clock } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function AlertStats() {
  const [dateRange, setDateRange] = React.useState<{
    from: Date
    to: Date
  }>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const { stats, loading, error } = useAlertStats(dateRange.from, dateRange.to)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-4 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-300">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error Loading Alert Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load alert statistics. Please try again later.</p>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">No alert statistics available for the selected period.</p>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for charts
  const severityData = [
    { name: "High", value: stats.severityCounts.high, color: "#ef4444" },
    { name: "Medium", value: stats.severityCounts.medium, color: "#f97316" },
    { name: "Low", value: stats.severityCounts.low, color: "#eab308" },
  ]

  const statusData = [
    { name: "New", value: stats.statusCounts.new, color: "#3b82f6" },
    { name: "Read", value: stats.statusCounts.read, color: "#a855f7" },
    { name: "Resolved", value: stats.statusCounts.resolved, color: "#22c55e" },
  ]

  const typeData = Object.entries(stats.typeCounts).map(([type, count]) => ({
    name: type,
    count,
  }))

  const timelineData = stats.timeline.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    count: item.count,
  }))

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Alert Statistics</h2>
        <DatePickerWithRange dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Total Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold">{stats.totalAlerts}</span>
              <p className="text-sm text-gray-500 mt-2">
                {stats.percentChange > 0
                  ? `↑ ${stats.percentChange}% from previous period`
                  : stats.percentChange < 0
                    ? `↓ ${Math.abs(stats.percentChange)}% from previous period`
                    : "No change from previous period"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-500" />
              Average Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold">{stats.avgResponseTime}h</span>
              <p className="text-sm text-gray-500 mt-2">
                {stats.responseTimeChange > 0
                  ? `↑ ${stats.responseTimeChange}% slower than previous`
                  : stats.responseTimeChange < 0
                    ? `↓ ${Math.abs(stats.responseTimeChange)}% faster than previous`
                    : "Same as previous period"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold">{stats.resolutionRate}%</span>
              <p className="text-sm text-gray-500 mt-2">
                {stats.resolutionRateChange > 0
                  ? `↑ ${stats.resolutionRateChange}% from previous period`
                  : stats.resolutionRateChange < 0
                    ? `↓ ${Math.abs(stats.resolutionRateChange)}% from previous period`
                    : "No change from previous period"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Alerts by Severity</CardTitle>
            <CardDescription>Distribution of alerts by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts by Status</CardTitle>
            <CardDescription>Current status of alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alerts by Type</CardTitle>
          <CardDescription>Distribution of alerts by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Timeline</CardTitle>
          <CardDescription>Number of alerts over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
