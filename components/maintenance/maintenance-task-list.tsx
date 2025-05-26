"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, ClipboardList } from "lucide-react"
import { MaintenanceTaskModal } from "@/components/maintenance/maintenance-task-modal"
import { MaintenanceTaskDetailModal } from "@/components/maintenance/maintenance-task-detail-modal"
import { Pagination } from "@/components/ui/pagination"
import type { MaintenanceTask } from "@/types/maintenance"

interface MaintenanceTaskListProps {
  tasks: MaintenanceTask[]
  loading: boolean
  error: Error | null
  onRefresh: () => void
}

export function MaintenanceTaskList({ tasks, loading, error, onRefresh }: MaintenanceTaskListProps) {
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleTaskClick = (task: MaintenanceTask) => {
    setSelectedTask(task)
    setIsDetailModalOpen(true)
  }

  const handleEditClick = (task: MaintenanceTask) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }

  const getPriorityColor = (priority: string) => {
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

  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
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
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <div className="flex items-center text-red-600">
          <AlertTriangle className="mr-2 h-5 w-5" />
          <span className="font-medium">Error loading maintenance tasks</span>
        </div>
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
        <Button variant="outline" className="mt-4" onClick={onRefresh}>
          Try Again
        </Button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No maintenance tasks found</h3>
        <p className="mt-1 text-gray-500">Create a new task to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => handleTaskClick(task)}
        >
          <div className="space-y-2">
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center gap-2">
              <span>
                {task.assetType}: {task.assetId}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              {task.assignedTo && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>Assigned to: {task.assignedTo}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
          </div>
        </div>
      ))}

      <div className="mt-6">
        <Pagination totalItems={tasks.length} itemsPerPage={10} currentPage={1} onPageChange={() => {}} />
      </div>

      {selectedTask && (
        <>
          <MaintenanceTaskDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false)
              setSelectedTask(null)
            }}
            task={selectedTask}
            onEdit={() => {
              setIsDetailModalOpen(false)
              setIsEditModalOpen(true)
            }}
            onRefresh={onRefresh}
          />

          <MaintenanceTaskModal
            open={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false)
              setSelectedTask(null)
            }}
            task={selectedTask}
            onTaskCreated={onRefresh}
          />
        </>
      )}
    </div>
  )
}
