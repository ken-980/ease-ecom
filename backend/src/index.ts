import express, { Application, Response, Request } from "express"
import 'dotenv/config'
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin-routes/admin-routes";


const app: Application = express();


app.use(cors({
    credentials: true,
    origin: ["http://localhost:4173"]
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));




const PORT = process.env.PORT || 3000;


//routes
app.use("/admin", adminRoutes)


app.get("/", (req: Request, res: Response) => {

    console.log("ok");
    res.send('ok');
})

app.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`);
})

