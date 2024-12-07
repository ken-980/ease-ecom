import express, { Application } from "express"
import { clerkMiddleware } from "@clerk/express";
import 'dotenv/config'
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";



const app: Application = express();


app.use(cors({
    credentials: true,
    origin: ["http://localhost:4173"]
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware())

const PORT = process.env.PORT || 3000;

//routes
//admin routes
app.use("/admin", adminRoutes)

//shop routes
app.use("/shop", shopRoutes)

app.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`);
})



