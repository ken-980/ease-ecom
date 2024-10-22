import express, { Request, Response } from "express";
import adminRegisterController from "../../controllers/admin/signup-controller";
import { signedInCookieVerify } from "../../middleware/admin/signed-in-cookie-verify";
import signInController from "../../controllers/admin/signin-controller";
import adminHomeController from "../../controllers/admin/admin-home-controller";
import signOutController from "../../controllers/admin/sign-out-controller";
import adminDetail from "../../controllers/admin/admin-detail";
import productUploadController from "../../controllers/admin/product-upload-controller";
import Redis from "redis"

import multer from "multer";
import { recentProductController } from "../../controllers/admin/inventory-page-controller";
import { deleteRecordController } from "../../controllers/admin/delete-record-controller";
import { productInfoController } from "../../controllers/admin/product-info-controller";
import { editProductCrontroller } from "../../controllers/admin/edit-product-controller";

const memorystorage = multer.memoryStorage();
const upload = multer({ storage: memorystorage })

const adminRoutes = express.Router();


adminRoutes.post("/", (req: Request, res: Response) => adminHomeController(req, res));

adminRoutes.post("/sign-out", (req: Request, res: Response) => signOutController(req, res))

adminRoutes.post("/register", (req: Request, res: Response) => adminRegisterController(req, res));

adminRoutes.post("/signin", (req: Request, res: Response) => signInController(req, res));


//middleware here
adminRoutes.use(signedInCookieVerify);

//admin data
adminRoutes.get("/adminData/:adminId", (req: Request, res: Response) => adminDetail(req, res));


//product upload
adminRoutes.post("/product-upload", upload.array("product-images", 10), (req: Request, res: Response) => productUploadController(req, res));


//inventory page loader
//page items
adminRoutes.get("/recent/:productNumber", (req: Request, res: Response) => recentProductController(req, res));


//get a product-info
adminRoutes.get("/product/:productId", (req: Request, res: Response) => productInfoController(req, res));

//edit-product
adminRoutes.post("/edit-product", upload.array("newImages", 10), (req: Request, res: Response) => editProductCrontroller(req, res));

//dashboard home loader
adminRoutes.get("/dashboarData", (req: Request, res: Response) => res.send("ok"))


export default adminRoutes;