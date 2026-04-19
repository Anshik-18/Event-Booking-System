import { Event, Booking } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

class Database {
  private events: Map<string, Event> = new Map();
  private bookings: Map<string, Booking> = new Map();

  // Events API
  createEvent(eventData: Omit<Event, 'id'>): Event {
    const id = uuidv4();
    const event: Event = { ...eventData, id };
    this.events.set(id, event);
    return event;
  }

  updateEvent(id: string, updates: Partial<Omit<Event, 'id' | 'organizerId'>>): Event | null {
    const event = this.events.get(id);
    if (!event) return null;

    const updatedEvent = { ...event, ...updates };
    // Recalculate available tickets if total is modified
    if (updates.totalTickets !== undefined && updates.totalTickets !== event.totalTickets) {
      const diff = updates.totalTickets - event.totalTickets;
      updatedEvent.availableTickets = event.availableTickets + diff;
    }

    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  deleteEvent(id: string): boolean {
    return this.events.delete(id);
  }

  getEvent(id: string): Event | undefined {
    return this.events.get(id);
  }

  getAllEvents(): Event[] {
    return Array.from(this.events.values());
  }

  // Bookings API
  createBooking(userId: string, eventId: string, ticketCount: number): Booking {
    const event = this.events.get(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    const eventDate = new Date(event.date);
    if (eventDate < new Date()) {
      throw new Error('Cannot book tickets for past events');
    }

    if (ticketCount <= 0) {
      throw new Error('Ticket count must be greater than zero');
    }

    if (event.availableTickets < ticketCount) {
      throw new Error('Not enough tickets available');
    }

    event.availableTickets -= ticketCount;
    this.events.set(eventId, event); // ensure update is recorded

    const booking: Booking = {
      id: uuidv4(),
      userId,
      eventId,
      ticketCount
    };
    this.bookings.set(booking.id, booking);

    return booking;
  }

  getBookingsByEvent(eventId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(b => b.eventId === eventId);
  }
}

export const db = new Database();
