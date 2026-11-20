import express, { Application } from "express"
import { clerkMiddleware } from "@clerk/express";
import 'dotenv/config'
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes";
import shopRoutes from "./routes/shop";




const app: Application = express();


app.use(cors({
    credentials: true,
    origin: ["http://localhost:4173"]
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    console.log("App endpoint working")
    res.status(200).send("App working")
})

//routes

//admin routes
app.use("/admin", adminRoutes)


//shop routes
app.use("/shop", shopRoutes)




app.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`);
})



