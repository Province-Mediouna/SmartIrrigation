import { ApiService } from "./api-service"
import type { Event, EventFilter, EventSubscription } from "../types/event"

class EventsService extends ApiService {
  private readonly EVENTS_ENDPOINT = "/events"

  // Récupérer les événements avec pagination et filtres
  async getEvents(filters: EventFilter = {}): Promise<{ data: Event[]; total: number; page: number; size: number }> {
    try {
      const queryParams = new URLSearchParams()

      if (filters.type) queryParams.append("type", filters.type)
      if (filters.severity) queryParams.append("severity", filters.severity)
      if (filters.startDate) queryParams.append("startDate", filters.startDate.toISOString())
      if (filters.endDate) queryParams.append("endDate", filters.endDate.toISOString())
      if (filters.stationId) queryParams.append("stationId", filters.stationId)
      if (filters.parcelId) queryParams.append("parcelId", filters.parcelId)
      queryParams.append("page", (filters.page || 1).toString())
      queryParams.append("size", (filters.size || 10).toString())

      return await this.get<{ data: Event[]; total: number; page: number; size: number }>(
        `${this.EVENTS_ENDPOINT}?${queryParams.toString()}`,
      )
    } catch (error) {
      console.error("Failed to get events:", error)
      throw error
    }
  }

  // Récupérer un événement par son ID
  async getEventById(eventId: string): Promise<Event> {
    try {
      return await this.get<Event>(`${this.EVENTS_ENDPOINT}/${eventId}`)
    } catch (error) {
      console.error(`Failed to get event ${eventId}:`, error)
      throw error
    }
  }

  // S'abonner à des notifications d'événements
  async subscribe(subscription: EventSubscription): Promise<{ subscriptionId: string }> {
    try {
      return await this.post<{ subscriptionId: string }>(`${this.EVENTS_ENDPOINT}/subscribe`, subscription)
    } catch (error) {
      console.error("Failed to subscribe to events:", error)
      throw error
    }
  }

  // Se désabonner des notifications d'événements
  async unsubscribe(subscriptionId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.EVENTS_ENDPOINT}/subscriptions/${subscriptionId}`)
    } catch (error) {
      console.error(`Failed to unsubscribe from events (subscription ${subscriptionId}):`, error)
      throw error
    }
  }

  // Marquer un événement comme lu
  async markAsRead(eventId: string): Promise<Event> {
    try {
      return await this.post<Event>(`${this.EVENTS_ENDPOINT}/${eventId}/read`, {})
    } catch (error) {
      console.error(`Failed to mark event ${eventId} as read:`, error)
      throw error
    }
  }

  // Marquer plusieurs événements comme lus
  async markMultipleAsRead(eventIds: string[]): Promise<void> {
    try {
      await this.post<void>(`${this.EVENTS_ENDPOINT}/read-multiple`, { eventIds })
    } catch (error) {
      console.error("Failed to mark multiple events as read:", error)
      throw error
    }
  }

  // Récupérer les statistiques des événements
  async getEventStats(startDate?: Date, endDate?: Date): Promise<{ [type: string]: { [severity: string]: number } }> {
    try {
      const queryParams = new URLSearchParams()
      if (startDate) queryParams.append("startDate", startDate.toISOString())
      if (endDate) queryParams.append("endDate", endDate.toISOString())

      return await this.get<{ [type: string]: { [severity: string]: number } }>(
        `${this.EVENTS_ENDPOINT}/stats?${queryParams.toString()}`,
      )
    } catch (error) {
      console.error("Failed to get event statistics:", error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const eventsService = new EventsService()
