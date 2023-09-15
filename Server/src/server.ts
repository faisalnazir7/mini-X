import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/userRoute';
import postRoute from './routes/postRoute';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error('MONGO_URI environment variable is not defined.');
}

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://mini-x.vercel.app",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.send('Home Page');
});

// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/post", postRoute);

// Connect to DB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log('Server Running on port ' + PORT);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
