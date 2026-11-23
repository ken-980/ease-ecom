// src/routes/adminRoutes.ts
import express from 'express';

import signInController from '../controllers/admin/signin-controller';
import adminRegisterController from '../controllers/admin/signup-controller';
import adminSignOutController from '../controllers/admin/sign-out-controller';
import adminHomeController from '../controllers/admin/admin-home-controller';
import { getMeController } from '../controllers/admin/getMeController';
import adminDetail from '../controllers/admin/admin-detail';
import { productUploaderController } from '../controllers/admin/product-upload-controller';
import { recentProductController } from '../controllers/admin/inventory-page-controller';
import { deleteRecordController } from '../controllers/admin/delete-record-controller';
import {
  getProductDetailController,
  updateProductController,
} from '../controllers/admin/edit-product-controller';
import { dashboardViewDataController } from '../controllers/admin/dashboard-view-data-controller';
import { getInventoryOverviewController } from '../controllers/admin/inventory-overview-controller';

import { verifyAdminAuth } from '../middleware/admin/verifyAdminAuth';
import {
  parseProductMediaFields,
  handleCloudinaryUploads,
} from '../middleware/admin/product-upload-middleware';

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
  handleCloudinaryUploads ({requireThumbnail: true}),
  productUploaderController
);

// Inventory Management
adminRoutes.get('/inventory/overview', getInventoryOverviewController);
adminRoutes.get('/recent/:productNumber', recentProductController);

// Product Detail & Editing (Aligned with editProductLoader & editProductAction)
adminRoutes.get('/products/:productId', getProductDetailController);
adminRoutes.patch(
  '/products/:productId',
  parseProductMediaFields,
  handleCloudinaryUploads({requireThumbnail: false}),
  updateProductController
);

// Legacy alias (keep only if an older view page still calls /admin/product/:productId)
adminRoutes.delete('/del', deleteRecordController);

export default adminRoutes;