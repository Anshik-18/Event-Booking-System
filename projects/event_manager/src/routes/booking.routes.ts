import { Router } from 'express';
import { bookTickets } from '../controllers/booking.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication to all booking routes
router.use(authenticate);

// Customer only routes
router.post('/', requireRole('customer'), bookTickets);

export default router;
