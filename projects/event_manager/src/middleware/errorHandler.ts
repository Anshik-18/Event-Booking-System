import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  
  if (err.message === 'Event not found' || err.message === 'Booking not found') {
    res.status(404).json({ error: err.message });
    return;
  }
  
  if (err.message.startsWith('Unauthorized') || err.message.startsWith('Forbidden')) {
    res.status(403).json({ error: err.message });
    return;
  }

  if (
    err.message.includes('past events') || 
    err.message.includes('Not enough tickets') || 
    err.message.includes('must be greater than zero') ||
    err.message.includes('below amount already sold')
  ) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
