"use client"

import { useState } from "react"
import { useMaintenanceTasks } from "@/hooks/use-maintenance"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Edit, Trash2, CheckCircle } from "lucide-react"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import type { MaintenanceTask } from "@/types/maintenance"

interface MaintenanceTaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: MaintenanceTask
  onEdit: () => void
  onRefresh: () => void
}

export function MaintenanceTaskDetailModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onRefresh,
}: MaintenanceTaskDetailModalProps) {
  const { toast } = useToast()
  const { deleteTask, completeTask } = useMaintenanceTasks()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [completionNotes, setCompletionNotes] = useState("")
  const [showCompleteForm, setShowCompleteForm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTask(task.id)
      toast({
        title: "Task deleted",
        description: "The maintenance task has been deleted successfully.",
      })
      onClose()
      onRefresh()
    } catch (error) {
      console.error("Failed to delete task:", error)
      toast({
        title: "Error",
        description: "Failed to delete the maintenance task.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await completeTask(task.id, completionNotes)
      toast({
        title: "Task completed",
        description: "The maintenance task has been marked as completed.",
      })
      onClose()
      onRefresh()
    } catch (error) {
      console.error("Failed to complete task:", error)
      toast({
        title: "Error",
        description: "Failed to complete the maintenance task.",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
      setShowCompleteForm(false)
    }
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{task.title}</span>
              <div className="flex space-x-2">
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
              </div>
            </DialogTitle>
            <DialogDescription>
              Asset: {task.assetType} - {task.assetId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Assigned To</p>
                <p className="text-sm">{task.assignedTo || "Not assigned"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm whitespace-pre-line">{task.description || "No description provided."}</p>
            </div>

            {task.completionNotes && (
              <div>
                <p className="text-sm font-medium">Completion Notes</p>
                <p className="text-sm whitespace-pre-line">{task.completionNotes}</p>
              </div>
            )}

            {showCompleteForm && (
              <div className="space-y-2">
                <Label htmlFor="completionNotes">Completion Notes</Label>
                <Textarea
                  id="completionNotes"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Enter notes about the completed task"
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={onEdit} disabled={isDeleting || isCompleting}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <div className="flex gap-2">
              {task.status !== "completed" && (
                <Button
                  variant="outline"
                  className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                  onClick={() => setShowCompleteForm(!showCompleteForm)}
                  disabled={isDeleting || isCompleting}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {showCompleteForm ? "Cancel" : "Complete"}
                </Button>
              )}
              {showCompleteForm ? (
                <Button onClick={handleComplete} disabled={isCompleting}>
                  {isCompleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    "Save & Complete"
                  )}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting || isCompleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Maintenance Task"
        description="Are you sure you want to delete this maintenance task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        confirmVariant="destructive"
      />
    </>
  )
}
