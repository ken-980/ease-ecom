// src/controllers/admin/sign-out-controller.ts
import { Response, Request } from 'express';
import { cookieName } from '../../configs/global-config';
import { logger } from '../../../logger';

const adminSignOutController = async (_req: Request, res: Response) => {
  try {
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Signed out successfully.',
    });
  } catch (error) {
    logger.log({
      level: 'error',
      message: `Sign out controller error: ${error}`,
    });

    return res.status(500).json({
      success: false,
      message: 'Failed to sign out.',
    });
  }
};

export default adminSignOutController;