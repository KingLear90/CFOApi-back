import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    limit: 4,
    message: {"error": 'Too many requests, please try again later'},
})