"use client"

import { useState } from "react"
import { useMaintenanceTasks, useMaintenanceStats } from "@/hooks/use-maintenance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MaintenanceTaskList } from "@/components/maintenance/maintenance-task-list"
import { MaintenanceTaskModal } from "@/components/maintenance/maintenance-task-modal"
import { MaintenanceStats } from "@/components/maintenance/maintenance-stats"
import { MaintenanceCalendar } from "@/components/maintenance/maintenance-calendar"
import { DatePickerWithRange } from "@/components/shared/date-picker-with-range"
import { Plus, Filter, RefreshCw, Calendar, BarChart, ClipboardList } from "lucide-react"
import { addDays } from "date-fns"
import type { MaintenanceTaskFilter } from "@/types/maintenance"

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date | undefined
  }>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filter: MaintenanceTaskFilter = {
    status: statusFilter,
    priority: priorityFilter,
    search: searchQuery,
    startDate: dateRange.from,
    endDate: dateRange.to,
    page: currentPage,
    size: pageSize,
  }

  const { tasks, loading, error, refreshTasks, total } = useMaintenanceTasks(filter)
  const { stats } = useMaintenanceStats()

  const handleRefresh = () => {
    refreshTasks()
  }

  const handleClearFilters = () => {
    setStatusFilter(undefined)
    setPriorityFilter(undefined)
    setSearchQuery("")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Maintenance</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Maintenance Tasks</CardTitle>
                  <CardDescription>View and manage maintenance tasks</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Input
                      placeholder="Search tasks..."
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={priorityFilter}
                      onValueChange={(value: any) => setPriorityFilter(value || undefined)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <span>{priorityFilter || "Priority"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    {(statusFilter || priorityFilter || searchQuery) && (
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
              <MaintenanceTaskList
                tasks={tasks}
                loading={loading}
                error={error}
                onRefresh={refreshTasks}
                totalItems={total}
                currentPage={currentPage}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Maintenance Calendar</CardTitle>
                  <CardDescription>View scheduled maintenance tasks</CardDescription>
                </div>
                <DatePickerWithRange
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  align="end"
                  className="w-full sm:w-auto"
                />
              </div>
            </CardHeader>
            <CardContent>
              <MaintenanceCalendar tasks={tasks} loading={loading} dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <MaintenanceStats stats={stats} />
        </TabsContent>
      </Tabs>

      <MaintenanceTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={refreshTasks}
      />
    </div>
  )
}
