export type UserRole = 'organizer' | 'customer';

export interface User {
  id: string;
  role: UserRole;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  totalTickets: number;
  availableTickets: number;
  organizerId: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  ticketCount: number;
}
