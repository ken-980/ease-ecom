// src/controllers/admin/get-me-controller.ts
import { Request, Response } from 'express';
import { prismaClientInstance } from '../../db/prismaClient';

export const getMeController = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id;
    const adminUserName = req.user?.userName;

    if (!adminId && !adminUserName) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin session not found.',
      });
    }

    const admin = await prismaClientInstance.admin.findUnique({
      where: adminId ? { id: adminId } : { userName: adminUserName },
      select: {
        id: true,
        userName: true,
        fullname: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin account no longer exists.',
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin session.',
    });
  }
};