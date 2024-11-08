import express, { Request, Response } from "express";
import { shopHomeController } from "../controllers/shop/shop-home-controller";


const shopRoutes = express.Router()


//shop/shopHome
//shop home controller
shopRoutes.get("/shopHome", (req: Request, res: Response) => shopHomeController(req, res))

export default shopRoutes;