import { productUploaderController } from './../controllers/admin/product-upload-controller';
import express, { Request, Response } from "express";
import multer from "multer";


import adminRegisterController from "../controllers/admin/signup-controller";
import { signedInCookieVerify } from "../middleware/admin/signed-in-cookie-verify";

import signInController from "../controllers/admin/signin-controller";
import adminHomeController from "../controllers/admin/admin-home-controller";

import signOutController from "../controllers/admin/sign-out-controller";
import adminDetail from "../controllers/admin/admin-detail";

import { recentProductController } from "../controllers/admin/inventory-page-controller";

import { deleteRecordController } from "../controllers/admin/delete-record-controller";
import { productInfoController } from "../controllers/admin/product-info-controller";

import { editProductCrontroller } from "../controllers/admin/edit-product-controller";
import { mainProductImageController } from "../controllers/admin/main-product-image-adding-controller";
import { handleCloudinaryUploads } from "../middleware/admin/upload-middleware";
import { dashboardViewDataController } from '../controllers/admin/dashboard-view-data-controller';

//init
const memorystorage = multer.memoryStorage();
const upload = multer({ storage: memorystorage })

const adminRoutes = express.Router();


adminRoutes.post("/",  adminHomeController);

adminRoutes.post("/sign-out", signOutController)

adminRoutes.post("/register", adminRegisterController);

adminRoutes.post("/signin", signInController);


//middleware here
adminRoutes.use(signedInCookieVerify);

//admin data
adminRoutes.get("/adminData/:adminId", adminDetail);


//product upload
adminRoutes.post("/product-upload", handleCloudinaryUploads,  productUploaderController);


//inventory page loader
//page items
adminRoutes.get("/recent/:productNumber", recentProductController);


adminRoutes.delete("/del", deleteRecordController);

//get a product-info
adminRoutes.get("/product/:productId", productInfoController);

//edit-product
adminRoutes.post("/edit-product", upload.array("newImages", 10), editProductCrontroller);


//upload product main photo
adminRoutes.post("/mainProductPhoto", upload.single("mainPhoto"), mainProductImageController);


//dashboard home loader
adminRoutes.get("/dashboardViewData", dashboardViewDataController);





export default adminRoutes;