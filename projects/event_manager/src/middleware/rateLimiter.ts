import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 
  max: 100, 
  message: { error: 'Too many requests from this IP, please try again after 1 minutes' },
  standardHeaders: true, 
  legacyHeaders: false,
});
