import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/userRoute';

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
app.use(cors());

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.send('Home Page');
});

// Routes Middleware
app.use("/api/users", userRoute);

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
