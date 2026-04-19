import { Router } from 'express';
import { createEvent, updateEvent, deleteEvent, getAllEvents, getEventById } from '../controllers/event.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication to all event routes
router.use(authenticate);

// Publicly readable events for authenticated users (both customer and organizer)
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Organizer only routes
router.post('/', requireRole('organizer'), createEvent);
router.put('/:id', requireRole('organizer'), updateEvent);
router.delete('/:id', requireRole('organizer'), deleteEvent);

export default router;
