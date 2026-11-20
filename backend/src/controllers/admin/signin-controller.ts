import { Request, Response } from 'express';
import ms from 'ms';
import { getAdminByUsername } from '../../services/db/admin/get-admin-by-username';
import { jwtTokenGen } from '../../services/jwt-token-gen';
import { getPassword } from '../../services/db/admin/get-password';
import { passwordDecode } from '../../services/password-decode';
import { cookieName } from '../../configs/global-config';
import { logger } from '../../../logger';

/**
 * Authenticates an admin and sets an HttpOnly session cookie
 */
const signInController = async (req: Request, res: Response) => {
  try {
    const rawUsername = req.body?.username;
    const password = req.body?.password;

    const username =
      typeof rawUsername === 'string' ? rawUsername.trim() : '';

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required.',
        success: false,
      });
    }

    const hashedPassword = await getPassword(username);

    if (!hashedPassword) {
      return res.status(401).json({
        message: 'Invalid username or password.',
        success: false,
      });
    }

    const isPasswordValid = await passwordDecode(password, hashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid username or password.',
        success: false,
      });
    }

    const adminIdByUsername = await getAdminByUsername(username);

    if (adminIdByUsername === null || adminIdByUsername === undefined) {
      return res.status(500).json({
        message: 'Server error, please try again.',
        success: false,
      });
    }

    const cookieToken = jwtTokenGen(username);

    if (!cookieToken) {
      return res.status(500).json({
        message: 'Server error, please try again.',
        success: false,
      });
    }

    res.cookie(cookieName, cookieToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: ms('8h'),
      path: '/',
    });

    return res.status(200).json({
      message: 'Signed in successfully.',
      success: true,
      username,
      adminId: adminIdByUsername,
    });
  } catch (error) {
    logger.log({
      level: 'error',
      message: `Sign in controller error: ${error}`,
    });

    return res.status(500).json({
      message: 'Server error, please try again.',
      success: false,
    });
  }
};

export default signInController;