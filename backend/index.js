import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import UserRoute from "./Routes/UserRoute.js";
import path from "path";
import registerRoute from "./Routes/registerRoute.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true                
}));
dotenv.config();

connectDB();
const _dirname = path.resolve();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", UserRoute);
app.use("/uploads", express.static(path.join(_dirname, "/uploads")));
app.use("/api/register", registerRoute);  

const port = process.env.PORT;

app.listen(port, () => console.log(`http://localhost:${port}`));
