"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAlertRules } from "@/hooks/use-alerts"
import { useToast } from "@/hooks/use-toast"
import type { AlertRule } from "@/types/alert"

interface AlertRuleModalProps {
  isOpen: boolean
  onClose: () => void
  rule: AlertRule | null
}

export function AlertRuleModal({ isOpen, onClose, rule }: AlertRuleModalProps) {
  const { createRule, updateRule } = useAlertRules()
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<AlertRule>>({
    name: "",
    description: "",
    type: "",
    condition: {
      parameter: "",
      operator: "gt",
      value: 0,
    },
    severity: "medium",
    isActive: true,
    notificationChannels: ["email"],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (rule) {
      setFormData({
        ...rule,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        type: "",
        condition: {
          parameter: "",
          operator: "gt",
          value: 0,
        },
        severity: "medium",
        isActive: true,
        notificationChannels: ["email"],
      })
    }
  }, [rule, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleConditionChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      condition: {
        ...prev.condition!,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      let success = false

      if (rule) {
        // Update existing rule
        success = await updateRule(rule.id, formData)
        if (success) {
          toast({
            title: "Rule updated",
            description: "The alert rule has been updated successfully.",
          })
        }
      } else {
        // Create new rule
        success = await createRule(formData)
        if (success) {
          toast({
            title: "Rule created",
            description: "The alert rule has been created successfully.",
          })
        }
      }

      if (success) {
        onClose()
      } else {
        toast({
          title: "Operation failed",
          description: `Failed to ${rule ? "update" : "create"} the alert rule.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving alert rule:", error)
      toast({
        title: "Operation failed",
        description: `An error occurred while ${rule ? "updating" : "creating"} the alert rule.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Alert Rule" : "Create Alert Rule"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Rule name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Rule description"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Input
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Rule type"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Condition</Label>
            <div className="col-span-3 grid grid-cols-3 gap-2">
              <Input
                value={formData.condition?.parameter}
                onChange={(e) => handleConditionChange("parameter", e.target.value)}
                placeholder="Parameter"
              />
              <Select
                value={formData.condition?.operator}
                onValueChange={(value) => handleConditionChange('operator", value)}erator', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gt">Greater than</SelectItem>
                  <SelectItem value="lt">Less than</SelectItem>
                  <SelectItem value="eq">Equal to</SelectItem>
                  <SelectItem value="neq">Not equal to</SelectItem>
                  <SelectItem value="gte">Greater than or equal</SelectItem>
                  <SelectItem value="lte">Less than or equal</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={formData.condition?.value as number}
                onChange={(e) => handleConditionChange("value", Number.parseFloat(e.target.value))}
                placeholder="Value"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="severity" className="text-right">
              Severity
            </Label>
            <Select
              value={formData.severity}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: value as any }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">
              Active
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">{formData.isActive ? "Enabled" : "Disabled"}</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : rule ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
