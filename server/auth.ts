import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, AdminUser } from './db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'sizzle-smoke-dev-secret-key-super-secure-2026';
export const TOKEN_EXPIRY = '24h';

export interface AuthenticatedRequest extends Request {
  adminUser?: AdminUser;
}

// In-memory rate limiter for login
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const loginRateLimitMap = new Map<string, RateLimitRecord>();

export const loginRateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10;

  const record = loginRateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    loginRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxAttempts) {
    const remainingSecs = Math.ceil((record.resetTime - now) / 1000);
    res.status(429).json({
      error: `Too many login attempts. Please try again in ${remainingSecs} seconds.`,
      retryAfterSeconds: remainingSecs,
    });
    return;
  }

  record.count += 1;
  next();
};

export const generateToken = (user: AdminUser): string => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Missing or invalid Bearer token.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = db.getUserById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'User no longer exists or session expired.' });
      return;
    }
    req.adminUser = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    return;
  }
};
