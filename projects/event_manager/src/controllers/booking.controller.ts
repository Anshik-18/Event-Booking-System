import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';

export const bookTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventId, ticketCount } = req.body;
    const userId = req.user!.id;

    if (!eventId || ticketCount === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const booking = await bookingService.bookTickets(userId, eventId, Number(ticketCount));
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};
