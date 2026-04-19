import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/event.service';

export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, date, totalTickets } = req.body;
    const organizerId = req.user!.id;
    
    if (!title || !description || !date || totalTickets === undefined) {
      console.log("Missing required fields:", { title, description, date, totalTickets });
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const event = await eventService.createEvent({ title, description, date, totalTickets: Number(totalTickets) }, organizerId);
    console.log('Event created:', event);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updates = req.body;
    const organizerId = req.user!.id;

    const event = await eventService.updateEvent(id, organizerId, updates);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const organizerId = req.user!.id;

    await eventService.deleteEvent(id, organizerId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const events = await eventService.getEvents();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const event = await eventService.getEventById(id);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};
