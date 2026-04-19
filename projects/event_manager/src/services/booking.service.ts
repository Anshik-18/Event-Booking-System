import { db } from './db';
import { publishBookingConfirmation } from '../jobs/producer';
import { Booking } from '../models/types';

export class BookingService {
  async bookTickets(userId: string, eventId: string, ticketCount: number): Promise<Booking> {
    const booking = db.createBooking(userId, eventId, ticketCount);
    
    // Publish to Kafka non-blockingly
    publishBookingConfirmation(userId, eventId, booking.id).catch(console.error);

    return booking;
  }
}

export const bookingService = new BookingService();
