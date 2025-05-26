"use client"

import { useState } from "react"
import { useAlertRules } from "@/hooks/use-alerts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash2, Plus, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { AlertRule } from "@/types/alert"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { AlertRuleModal } from "@/components/alerts/alert-rule-modal"

export function AlertRuleList() {
  const { rules, loading, error, toggleRuleStatus, deleteRule } = useAlertRules()
  const [selectedRule, setSelectedRule] = useState<AlertRule | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const handleToggleStatus = async (ruleId: string, enabled: boolean) => {
    const success = await toggleRuleStatus(ruleId, enabled)
    if (success) {
      toast({
        title: enabled ? "Rule enabled" : "Rule disabled",
        description: `The alert rule has been ${enabled ? "enabled" : "disabled"} successfully.`,
      })
    } else {
      toast({
        title: "Operation failed",
        description: `Failed to ${enabled ? "enable" : "disable"} the alert rule.`,
        variant: "destructive",
      })
    }
  }

  const handleEditRule = (rule: AlertRule) => {
    setSelectedRule(rule)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (ruleId: string) => {
    setRuleToDelete(ruleId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!ruleToDelete) return

    const success = await deleteRule(ruleToDelete)
    setIsDeleteDialogOpen(false)
    setRuleToDelete(null)

    if (success) {
      toast({
        title: "Rule deleted",
        description: "The alert rule has been deleted successfully.",
      })
    } else {
      toast({
        title: "Deletion failed",
        description: "Failed to delete the alert rule.",
        variant: "destructive",
      })
    }
  }

  const handleCreateRule = () => {
    setSelectedRule(null)
    setIsModalOpen(true)
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

  if (error) {
    return (
      <Card className="border-red-300">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error Loading Alert Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load alert rules. Please try again later.</p>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Alert Rules</h2>
        <Button onClick={handleCreateRule}>
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {rules.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No alert rules defined. Create your first rule to get started.</p>
              </CardContent>
            </Card>
          ) : (
            rules.map((rule) => (
              <Card key={rule.id} className={!rule.isActive ? "opacity-70" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {rule.name}
                        <Badge className={`ml-2 ${getSeverityColor(rule.severity)}`}>{rule.severity}</Badge>
                      </CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={(checked) => handleToggleStatus(rule.id, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Condition:</span>
                      <span>
                        {rule.condition.parameter} {rule.condition.operator} {rule.condition.value}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Notifications:</span>
                      <span>{rule.notificationChannels.join(", ")}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditRule(rule)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(rule.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      <AlertRuleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} rule={selectedRule} />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Alert Rule"
        description="Are you sure you want to delete this alert rule? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
