// src/routes/adminRoutes.ts
import express from 'express';
import multer from 'multer';

import signInController from '../controllers/admin/signin-controller';
import adminRegisterController from '../controllers/admin/signup-controller';
import adminSignOutController from '../controllers/admin/sign-out-controller';
import adminHomeController from '../controllers/admin/admin-home-controller';
import { getMeController } from '../controllers/admin/getMeController';
import adminDetail from '../controllers/admin/admin-detail';
import { productUploaderController } from '../controllers/admin/product-upload-controller';
import { recentProductController } from '../controllers/admin/inventory-page-controller';
import { deleteRecordController } from '../controllers/admin/delete-record-controller';
import { productInfoController } from '../controllers/admin/product-info-controller';
import { editProductCrontroller } from '../controllers/admin/edit-product-controller';
import { dashboardViewDataController } from '../controllers/admin/dashboard-view-data-controller';

import { verifyAdminAuth } from '../middleware/admin/verifyAdminAuth';
import {
  parseProductMediaFields,
  handleCloudinaryUploads,
} from '../middleware/admin/product-upload-middleware';
import { getInventoryOverviewController } from '../controllers/admin/inventory-overview-controller';

const upload = multer({ storage: multer.memoryStorage() });
const adminRoutes = express.Router();

// ==========================================
// PUBLIC ADMIN ENDPOINTS (No token needed)
// ==========================================
adminRoutes.post('/signin', signInController);
adminRoutes.post('/register', adminRegisterController);
adminRoutes.post('/logout', adminSignOutController);
adminRoutes.post('/sign-out', adminSignOutController); // Keep alias until frontend migrates

// ==========================================
// AUTH GATE (Protects every route below)
// ==========================================
adminRoutes.use(verifyAdminAuth);

// ==========================================
// PROTECTED ADMIN ENDPOINTS (req.user guaranteed)
// ==========================================
adminRoutes.get('/me', getMeController);
adminRoutes.post('/', adminHomeController);
adminRoutes.get('/adminData/:adminId', adminDetail);
adminRoutes.get('/dashboardViewData', dashboardViewDataController);

// Product Creation (New 3-field media pipeline + Prisma atomic insert)
adminRoutes.post(
  '/products',
  parseProductMediaFields,
  handleCloudinaryUploads,
  productUploaderController
);

// Inventory Management
adminRoutes.get("/inventory/overview", getInventoryOverviewController);

adminRoutes.get('/recent/:productNumber', recentProductController);
adminRoutes.get('/product/:productId', productInfoController);
adminRoutes.post(
  '/edit-product',
  upload.array('newImages', 10),
  editProductCrontroller
);
adminRoutes.delete('/del', deleteRecordController);

export default adminRoutes;