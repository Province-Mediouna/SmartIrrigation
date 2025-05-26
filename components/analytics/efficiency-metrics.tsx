"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Metric {
  name: string
  value: string
  change: number
}

interface EfficiencyMetricsProps {
  title: string
  metrics: Metric[]
}

export function EfficiencyMetrics({ title, metrics }: EfficiencyMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="flex items-center justify-between rounded-lg border p-3">
              <div className="text-sm font-medium">{metric.name}</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold">{metric.value}</div>
                <div
                  className={cn(
                    "flex items-center text-xs",
                    metric.change > 0 ? "text-green-500" : metric.change < 0 ? "text-red-500" : "text-gray-500",
                  )}
                >
                  {metric.change > 0 ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                  ) : metric.change < 0 ? (
                    <ArrowDownIcon className="mr-1 h-3 w-3" />
                  ) : null}
                  {Math.abs(metric.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
