"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, PieChart, LineChart } from "lucide-react"
import type { MaintenanceStats as MaintenanceStatsType } from "@/types/maintenance"

interface MaintenanceStatsProps {
  stats: MaintenanceStatsType | null
}

export function MaintenanceStats({ stats }: MaintenanceStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="mr-2 h-5 w-5" />
            Task Status Distribution
          </CardTitle>
          <CardDescription>Current status of maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="space-y-2">
                {Object.entries(stats.statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                      <div
                        className={`h-4 rounded-full ${getStatusColor(status)}`}
                        style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between min-w-[100px]">
                      <span className="text-sm font-medium">{formatStatus(status)}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="mr-2 h-5 w-5" />
            Task Priority Distribution
          </CardTitle>
          <CardDescription>Distribution by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="space-y-2">
                {Object.entries(stats.priorityDistribution).map(([priority, count]) => (
                  <div key={priority} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                      <div
                        className={`h-4 rounded-full ${getPriorityColor(priority)}`}
                        style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between min-w-[100px]">
                      <span className="text-sm font-medium capitalize">{priority}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="mr-2 h-5 w-5" />
            Asset Type Distribution
          </CardTitle>
          <CardDescription>Maintenance tasks by asset type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="space-y-2">
                {Object.entries(stats.assetTypeDistribution).map(([assetType, count]) => (
                  <div key={assetType} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                      <div
                        className="h-4 rounded-full bg-blue-500"
                        style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between min-w-[100px]">
                      <span className="text-sm font-medium capitalize">{assetType}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChart className="mr-2 h-5 w-5" />
            Completion Rate
          </CardTitle>
          <CardDescription>Task completion statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex flex-col items-center justify-center space-y-6">
            <div className="w-full flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-green-500"
                    strokeWidth="10"
                    strokeDasharray={`${stats.completionRate * 251.2} 251.2`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round(stats.completionRate * 100)}%</span>
                </div>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">On-time</p>
                <p className="text-lg font-bold">{stats.onTimeCompletion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delayed</p>
                <p className="text-lg font-bold">{stats.delayedCompletion}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-500"
    case "in_progress":
      return "bg-blue-500"
    case "completed":
      return "bg-green-500"
    case "cancelled":
      return "bg-gray-500"
    default:
      return "bg-gray-500"
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-orange-500"
    case "low":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
