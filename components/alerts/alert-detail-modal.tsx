"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAlerts } from "@/hooks/use-alerts"
import { useToast } from "@/hooks/use-toast"
import type { Alert } from "@/types/alert"

interface AlertDetailModalProps {
  isOpen: boolean
  onClose: () => void
  alert: Alert | null
}

export function AlertDetailModal({ isOpen, onClose, alert }: AlertDetailModalProps) {
  const { acknowledgeAlert, resolveAlert } = useAlerts()
  const { toast } = useToast()
  const [resolution, setResolution] = React.useState("")
  const [isResolving, setIsResolving] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setResolution("")
      setIsResolving(false)
    }
  }, [isOpen])

  if (!alert) return null

  const handleAcknowledge = async () => {
    if (!alert) return

    setLoading(true)
    const success = await acknowledgeAlert(alert.id)
    setLoading(false)

    if (success) {
      toast({
        title: "Alert acknowledged",
        description: "The alert has been marked as read.",
      })
      onClose()
    } else {
      toast({
        title: "Operation failed",
        description: "Failed to acknowledge the alert.",
        variant: "destructive",
      })
    }
  }

  const handleResolve = async () => {
    if (!alert) return

    setLoading(true)
    const success = await resolveAlert(alert.id, resolution)
    setLoading(false)

    if (success) {
      toast({
        title: "Alert resolved",
        description: "The alert has been marked as resolved.",
      })
      onClose()
    } else {
      toast({
        title: "Operation failed",
        description: "Failed to resolve the alert.",
        variant: "destructive",
      })
    }
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Alert Details</span>
            <div className="flex space-x-2">
              <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
              <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <p className="font-medium">Message</p>
            <p>{alert.message}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Type</p>
              <p className="text-sm">{alert.type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Source</p>
              <p className="text-sm">{alert.source}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm">{new Date(alert.timestamp).toLocaleString()}</p>
          </div>
          {alert.metadata && Object.keys(alert.metadata).length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Additional Information</p>
              <div className="rounded bg-muted p-2 text-sm">
                <pre className="whitespace-pre-wrap">{JSON.stringify(alert.metadata, null, 2)}</pre>
              </div>
            </div>
          )}
          {alert.resolution && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Resolution</p>
              <p className="text-sm">{alert.resolution}</p>
            </div>
          )}
          {isResolving && (
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution Notes</Label>
              <Textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Enter resolution details..."
                rows={3}
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex space-x-2">
            {alert.status === "new" && (
              <Button onClick={handleAcknowledge} disabled={loading}>
                {loading ? "Processing..." : "Acknowledge"}
              </Button>
            )}
            {alert.status !== "resolved" && (
              <>
                {isResolving ? (
                  <Button onClick={handleResolve} disabled={loading}>
                    {loading ? "Processing..." : "Confirm Resolution"}
                  </Button>
                ) : (
                  <Button onClick={() => setIsResolving(true)} disabled={loading}>
                    Resolve
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
