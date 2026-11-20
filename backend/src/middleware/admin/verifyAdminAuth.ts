// src/middleware/admin/verifyAdminAuth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { cookieName } from '../../configs/global-config';
import type { AuthenticatedAdminPayload } from '../../types/express';

interface AdminJwtPayload {
  adminName?: string;
  userName?: string;
  username?: string;
  id?: number;
}

export const verifyAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured on the server.');
    }

    const cookieToken = req.cookies?.[cookieName] as string | undefined;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No authentication token provided.',
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as AdminJwtPayload;
    const resolvedAdminName =
      decoded.adminName || decoded.userName || decoded.username;

    if (!resolvedAdminName) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid token payload.',
      });
    }

    req.user = {
      id: decoded.id ?? 0,
      userName: resolvedAdminName,
    };

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please sign in again.',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid authentication token.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication verification failed.',
    });
  }
};