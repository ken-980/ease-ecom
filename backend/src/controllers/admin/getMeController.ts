// src/controllers/admin/get-me-controller.ts
import { Request, Response } from 'express';
import { prismaClientInstance } from '../../db/prismaClient';

/**
 * Retrieves the authenticated administrator associated with the current request.
 *
 * Resolves the administrator using the authenticated request payload, verifies
 * that the account still exists, and returns a safe subset of account details.
 *
 * @param req - Express request containing the authenticated administrator payload.
 * @param res - Express response used to return the session status or account details.
 * @returns A promise that resolves to the JSON response sent by the Express server.
 */
export const getMeController = async (req: Request, res: Response) => {
  try {
    /**
     * Identifiers read from the authenticated administrator payload.
     */
    const adminId = req.user?.id;
    const adminUserName = req.user?.userName;

    /**
     * Reject requests that do not contain an administrator session identifier.
     */
    if (!adminId && !adminUserName) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin session not found.',
      });
    }

    /**
     * Look up the administrator by ID or username, whichever is available.
     */
    const admin = await prismaClientInstance.admin.findUnique({
      where: adminId ? { id: adminId } : { userName: adminUserName },
      select: {
        id: true,
        userName: true,
        fullname: true,
        createdAt: true,
      },
    });

    /**
     * Reject sessions whose administrator account no longer exists.
     */
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin account no longer exists.',
      });
    }

    /**
     * Return the administrator session and selected public account details.
     */
    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    /**
     * Return a generic failure response when the session lookup cannot complete.
     */
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin session.',
    });
  }
};