import { ClerkClient } from './../../node_modules/@clerk/backend/dist/index.d';
import express, { Request, Response } from "express";
import { shopHomeController } from "../controllers/shop/shop-home-controller";
import { createClerkClient } from "@clerk/backend";
import { clerkMiddleware } from '@clerk/express';

const shopRoutes = express.Router()

const clerkClinet = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })



//shop/shopHome
//shop home controller
shopRoutes.get("/shopHome", (req: Request, res: Response) => shopHomeController(req, res));


shopRoutes.use(clerkMiddleware())

shopRoutes.get("/auth-state", (req: Request, res: Response) => {
    // const authState = req?.auth
    // console.log(authState)
})

export default shopRoutes;