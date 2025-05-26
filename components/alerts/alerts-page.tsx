"use client"

import { useState } from "react"
import { useAlerts } from "@/hooks/use-alerts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Bell, Search, Filter, RefreshCw } from "lucide-react"
import { AlertDetailModal } from "@/components/alerts/alert-detail-modal"
import { AlertRuleList } from "@/components/alerts/alert-rule-list"
import { AlertStats } from "@/components/alerts/alert-stats"
import { Pagination } from "@/components/ui/pagination"
import type { Alert, AlertSeverity, AlertStatus } from "@/types/alert"

export function AlertsPage() {
  const [activeTab, setActiveTab] = useState("alerts")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<AlertStatus | undefined>(undefined)
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")

  const { alerts, loading, error, refreshAlerts } = useAlerts(statusFilter, severityFilter)

  // Filter alerts by search query
  const filteredAlerts = alerts.filter((alert) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      alert.message.toLowerCase().includes(query) ||
      alert.type.toLowerCase().includes(query) ||
      alert.source.toLowerCase().includes(query)
    )
  })

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert)
    setIsDetailModalOpen(true)
  }

  const handleRefresh = () => {
    refreshAlerts()
  }

  const handleClearFilters = () => {
    setStatusFilter(undefined)
    setSeverityFilter(undefined)
    setSearchQuery("")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "read":
        return "bg-purple-500"
      case "resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Alert List</CardTitle>
                  <CardDescription>View and manage system alerts</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value || undefined)}>
                      <SelectTrigger className="w-[130px]">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <span>{statusFilter || "Status"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={severityFilter}
                      onValueChange={(value: any) => setSeverityFilter(value || undefined)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <div className="flex items-center">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          <span>{severityFilter || "Severity"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    {(statusFilter || severityFilter || searchQuery) && (
                      <Button variant="ghost" size="icon" onClick={handleClearFilters}>
                        <span className="sr-only">Clear filters</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 border border-red-300 rounded-lg bg-red-50">
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    <span className="font-medium">Error loading alerts</span>
                  </div>
                  <p className="mt-2 text-sm text-red-600">{error.message}</p>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No alerts found</h3>
                  <p className="mt-1 text-gray-500">
                    {searchQuery || statusFilter || severityFilter
                      ? "Try adjusting your filters"
                      : "You're all caught up!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleAlertClick(alert)}
                    >
                      <div className="space-y-2">
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center gap-2">
                          <span>{alert.type}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{alert.source}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                        <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredAlerts.length > 0 && (
                <div className="mt-6">
                  <Pagination
                    totalItems={filteredAlerts.length}
                    itemsPerPage={10}
                    currentPage={1}
                    onPageChange={() => {}}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <AlertRuleList />
        </TabsContent>

        <TabsContent value="stats">
          <AlertStats />
        </TabsContent>
      </Tabs>

      <AlertDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedAlert(null)
        }}
        alert={selectedAlert}
      />
    </div>
  )
}
