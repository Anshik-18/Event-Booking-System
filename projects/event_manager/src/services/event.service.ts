import { db } from './db';
import { publishEventUpdate } from '../jobs/producer';
import { Event } from '../models/types';

export class EventService {
  async createEvent(
    data: { title: string; description: string; date: string; totalTickets: number },
    organizerId: string
  ): Promise<Event> {
    if (data.totalTickets <= 0) {
      throw new Error('Total tickets must be greater than zero');
    }

    const event = db.createEvent({
      ...data,
      availableTickets: data.totalTickets,
      organizerId,
    });
    return event;
  }

  async updateEvent(
    eventId: string,
    organizerId: string,
    updates: Partial<{ title: string; description: string; date: string; totalTickets: number }>
  ): Promise<Event> {
    const event = db.getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.organizerId !== organizerId) {
      throw new Error('Unauthorized: You do not own this event');
    }
    if (updates.totalTickets !== undefined) {
      const ticketsSold = event.totalTickets - event.availableTickets;
      if (updates.totalTickets < ticketsSold) {
        throw new Error('Cannot reduce total tickets below amount already sold');
      }
    }

    const updatedEvent = db.updateEvent(eventId, updates);
    if (!updatedEvent) {
      throw new Error('Failed to update event');
    }

    // Publish to Kafka non-blockingly
    publishEventUpdate(eventId).catch(console.error);

    return updatedEvent;
  }

  async deleteEvent(eventId: string, organizerId: string): Promise<void> {
    const event = db.getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.organizerId !== organizerId) {
      throw new Error('Unauthorized: You do not own this event');
    }

    const success = db.deleteEvent(eventId);
    if (!success) {
      throw new Error('Failed to delete event');
    }
  }

  async getEvents(): Promise<Event[]> {
    return db.getAllEvents();
  }

  async getEventById(eventId: string): Promise<Event> {
    const event = db.getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }
}

export const eventService = new EventService();
