import express from 'express';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
import { errorHandler } from './middleware/errorHandler';
import { globalRateLimiter } from './middleware/rateLimiter';

const app = express();

// Global Middlewares
app.use(express.json());
app.use(globalRateLimiter);

// Routes
app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);

// Error Handling Middleware MUST be applied last
app.use(errorHandler);

export default app;
