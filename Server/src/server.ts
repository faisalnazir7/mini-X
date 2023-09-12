import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("Home Page");
});

app.listen(PORT, () => {
  console.log("Server Running on port " + PORT);
});
