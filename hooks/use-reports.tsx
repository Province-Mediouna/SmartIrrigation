"use client"

import { useState, useEffect, useCallback } from "react"
import { reportsService } from "@/services/reports-service"
import type { Report, ReportFilter, ReportTemplate, ReportSchedule } from "@/types/report"

export function useReports(filter?: ReportFilter) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const response = await reportsService.getReports(filter)
      setReports(response.data)
      setTotalCount(response.totalCount)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch reports"))
      console.error("Error fetching reports:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const createReport = async (report: Partial<Report>) => {
    try {
      await reportsService.createReport(report)
      await fetchReports()
      return true
    } catch (err) {
      console.error("Error creating report:", err)
      return false
    }
  }

  const deleteReport = async (reportId: string) => {
    try {
      await reportsService.deleteReport(reportId)
      await fetchReports()
      return true
    } catch (err) {
      console.error(`Error deleting report ${reportId}:`, err)
      return false
    }
  }

  const downloadReport = async (reportId: string) => {
    try {
      return await reportsService.downloadReport(reportId)
    } catch (err) {
      console.error(`Error downloading report ${reportId}:`, err)
      throw err
    }
  }

  return {
    reports,
    loading,
    error,
    totalCount,
    refreshReports: fetchReports,
    createReport,
    deleteReport,
    downloadReport,
  }
}

export function useReportTemplates() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const data = await reportsService.getTemplates()
      setTemplates(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch report templates"))
      console.error("Error fetching report templates:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const createTemplate = async (template: Partial<ReportTemplate>) => {
    try {
      await reportsService.createTemplate(template)
      await fetchTemplates()
      return true
    } catch (err) {
      console.error("Error creating report template:", err)
      return false
    }
  }

  const updateTemplate = async (templateId: string, template: Partial<ReportTemplate>) => {
    try {
      await reportsService.updateTemplate(templateId, template)
      await fetchTemplates()
      return true
    } catch (err) {
      console.error(`Error updating report template ${templateId}:`, err)
      return false
    }
  }

  const deleteTemplate = async (templateId: string) => {
    try {
      await reportsService.deleteTemplate(templateId)
      await fetchTemplates()
      return true
    } catch (err) {
      console.error(`Error deleting report template ${templateId}:`, err)
      return false
    }
  }

  return {
    templates,
    loading,
    error,
    refreshTemplates: fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  }
}

export function useReportSchedules() {
  const [schedules, setSchedules] = useState<ReportSchedule[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true)
      const data = await reportsService.getSchedules()
      setSchedules(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch report schedules"))
      console.error("Error fetching report schedules:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const createSchedule = async (schedule: Partial<ReportSchedule>) => {
    try {
      await reportsService.createSchedule(schedule)
      await fetchSchedules()
      return true
    } catch (err) {
      console.error("Error creating report schedule:", err)
      return false
    }
  }

  const updateSchedule = async (scheduleId: string, schedule: Partial<ReportSchedule>) => {
    try {
      await reportsService.updateSchedule(scheduleId, schedule)
      await fetchSchedules()
      return true
    } catch (err) {
      console.error(`Error updating report schedule ${scheduleId}:`, err)
      return false
    }
  }

  const deleteSchedule = async (scheduleId: string) => {
    try {
      await reportsService.deleteSchedule(scheduleId)
      await fetchSchedules()
      return true
    } catch (err) {
      console.error(`Error deleting report schedule ${scheduleId}:`, err)
      return false
    }
  }

  const toggleSchedule = async (scheduleId: string, enabled: boolean) => {
    try {
      if (enabled) {
        await reportsService.enableSchedule(scheduleId)
      } else {
        await reportsService.disableSchedule(scheduleId)
      }
      await fetchSchedules()
      return true
    } catch (err) {
      console.error(`Error toggling report schedule ${scheduleId}:`, err)
      return false
    }
  }

  return {
    schedules,
    loading,
    error,
    refreshSchedules: fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
  }
}
