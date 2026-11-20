import { Response, Request } from 'express';
import ms from 'ms';
import { checkAdminUsernameExist } from '../../services/db/admin/check-admin-exist';
import { addNewAdmin } from '../../services/db/admin/add-new-admin';
import { passwordHash } from '../../services/password-hash';
import { jwtTokenGen } from '../../services/jwt-token-gen';
import { getAdminByUsername } from '../../services/db/admin/get-admin-by-username';
import { cookieName } from '../../configs/global-config';
import { logger } from '../../../logger';

/**
 * Registers a new admin and sets an HttpOnly session cookie
 */
const adminRegisterController = async (req: Request, res: Response) => {
  try {
    const rawUsername = req.body?.username;
    const password = req.body?.password;
    const passwordConfirm = req.body?.passwordConfirm;

    const username =
      typeof rawUsername === 'string' ? rawUsername.trim() : '';

    if (!username || !password || !passwordConfirm) {
      return res.status(400).json({
        message: 'All fields are required.',
        success: false,
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        message: 'Admin passwords do not match.',
        success: false,
      });
    }

    const userExist = await checkAdminUsernameExist(username);

    if (userExist) {
      return res.status(409).json({
        message: `Admin with username "${username}" already exists.`,
        success: false,
      });
    }

    const hashedPassword = await passwordHash(password);

    if (typeof hashedPassword !== 'string') {
      return res.status(500).json({
        message: 'Server error, please try again.',
        success: false,
      });
    }

    const newAdmin = await addNewAdmin(username, hashedPassword);

    if (!newAdmin) {
      return res.status(500).json({
        message: 'Server error, please try again.',
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

    return res.status(201).json({
      message: 'Admin registered successfully.',
      success: true,
      username,
      adminId: adminIdByUsername,
    });
  } catch (error) {
    logger.log({
      level: 'error',
      message: `Sign up controller error: ${error}`,
    });

    return res.status(500).json({
      message: 'Server error, please try again.',
      success: false,
    });
  }
};

export default adminRegisterController;