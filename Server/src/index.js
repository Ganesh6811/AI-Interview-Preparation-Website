import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./lib/connectDB.js";
import authRoute from "./Routes/Auth.route.js";
import interviewRoute from "./Routes/Interview.route.js";

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://ai-interview-preparation-website.vercel.app", 
    credentials: true,  
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],   
    allowedHeaders: ["Content-Type", "Authorization"],  
}))

app.use("/auth", authRoute);
app.use("/interview", interviewRoute);

app.listen(port, ()=>{
    console.log(`Server is working on port ${port}`);
    connectDB();
})
