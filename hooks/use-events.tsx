"use client"

import { useState, useEffect, useCallback } from "react"
import { eventsService } from "@/services/events-service"
import type { Event, EventFilter, EventSubscription, EventStats } from "@/types/event"

export function useEvents(filter?: EventFilter) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const response = await eventsService.getEvents(filter)
      setEvents(response.data)
      setTotalCount(response.totalCount)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch events"))
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const markAsRead = async (eventId: string) => {
    try {
      await eventsService.markAsRead(eventId)
      await fetchEvents()
      return true
    } catch (err) {
      console.error(`Error marking event ${eventId} as read:`, err)
      return false
    }
  }

  const markAllAsRead = async () => {
    try {
      await eventsService.markAllAsRead()
      await fetchEvents()
      return true
    } catch (err) {
      console.error("Error marking all events as read:", err)
      return false
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      await eventsService.deleteEvent(eventId)
      await fetchEvents()
      return true
    } catch (err) {
      console.error(`Error deleting event ${eventId}:`, err)
      return false
    }
  }

  return {
    events,
    loading,
    error,
    totalCount,
    refreshEvents: fetchEvents,
    markAsRead,
    markAllAsRead,
    deleteEvent,
  }
}

export function useEventSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<EventSubscription[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await eventsService.getSubscriptions()
      setSubscriptions(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch event subscriptions"))
      console.error("Error fetching event subscriptions:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const subscribe = async (subscription: Partial<EventSubscription>) => {
    try {
      await eventsService.subscribe(subscription)
      await fetchSubscriptions()
      return true
    } catch (err) {
      console.error("Error subscribing to events:", err)
      return false
    }
  }

  const unsubscribe = async (subscriptionId: string) => {
    try {
      await eventsService.unsubscribe(subscriptionId)
      await fetchSubscriptions()
      return true
    } catch (err) {
      console.error(`Error unsubscribing from events (${subscriptionId}):`, err)
      return false
    }
  }

  const updateSubscription = async (subscriptionId: string, subscription: Partial<EventSubscription>) => {
    try {
      await eventsService.updateSubscription(subscriptionId, subscription)
      await fetchSubscriptions()
      return true
    } catch (err) {
      console.error(`Error updating event subscription ${subscriptionId}:`, err)
      return false
    }
  }

  return {
    subscriptions,
    loading,
    error,
    refreshSubscriptions: fetchSubscriptions,
    subscribe,
    unsubscribe,
    updateSubscription,
  }
}

export function useEventStats(startDate?: Date, endDate?: Date) {
  const [stats, setStats] = useState<EventStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const data = await eventsService.getStats(startDate, endDate)
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch event statistics"))
      console.error("Error fetching event statistics:", err)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  }
}
