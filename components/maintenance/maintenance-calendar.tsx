"use client"

import { useState } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MaintenanceTaskDetailModal } from "@/components/maintenance/maintenance-task-detail-modal"
import { format, isSameDay } from "date-fns"
import type { MaintenanceTask } from "@/types/maintenance"

interface MaintenanceCalendarProps {
  tasks: MaintenanceTask[]
  loading: boolean
  dateRange: {
    from: Date
    to: Date | undefined
  }
}

export function MaintenanceCalendar({ tasks, loading, dateRange }: MaintenanceCalendarProps) {
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  if (loading) {
    return <Skeleton className="h-[500px] w-full" />
  }

  const handleDateClick = (date: Date) => {
    const tasksOnDate = tasks.filter((task) => isSameDay(new Date(task.dueDate), date))
    if (tasksOnDate.length === 1) {
      setSelectedTask(tasksOnDate[0])
      setIsDetailModalOpen(true)
    }
  }

  const getDayContent = (day: Date) => {
    const tasksOnDay = tasks.filter((task) => isSameDay(new Date(task.dueDate), day))
    if (tasksOnDay.length === 0) return null

    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <Badge
          className={`text-xs ${
            tasksOnDay.some((task) => task.priority === "high")
              ? "bg-red-500"
              : tasksOnDay.some((task) => task.priority === "medium")
                ? "bg-orange-500"
                : "bg-blue-500"
          }`}
        >
          {tasksOnDay.length}
        </Badge>
      </div>
    )
  }

  const tasksInRange = tasks.filter(
    (task) => dateRange.from <= new Date(task.dueDate) && (!dateRange.to || new Date(task.dueDate) <= dateRange.to),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <CalendarComponent
          mode="range"
          selected={{
            from: dateRange.from,
            to: dateRange.to,
          }}
          onDayClick={handleDateClick}
          components={{
            DayContent: ({ date }) => (
              <div className="relative h-full w-full p-2">
                <div>{format(date, "d")}</div>
                {getDayContent(date)}
              </div>
            ),
          }}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tasks in Selected Range</h3>
        {tasksInRange.length === 0 ? (
          <p className="text-center text-gray-500">No tasks in the selected date range.</p>
        ) : (
          <div className="space-y-2">
            {tasksInRange.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedTask(task)
                  setIsDetailModalOpen(true)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(task.dueDate), "PPP")} • {task.assetType}: {task.assetId}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge
                        className={
                          task.priority === "high"
                            ? "bg-red-500"
                            : task.priority === "medium"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                        }
                      >
                        {task.priority}
                      </Badge>
                      <Badge
                        className={
                          task.status === "pending"
                            ? "bg-yellow-500"
                            : task.status === "in_progress"
                              ? "bg-blue-500"
                              : task.status === "completed"
                                ? "bg-green-500"
                                : "bg-gray-500"
                        }
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <MaintenanceTaskDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedTask(null)
          }}
          task={selectedTask}
          onEdit={() => {
            // Handle edit
          }}
          onRefresh={() => {
            // Refresh tasks
          }}
        />
      )}
    </div>
  )
}
