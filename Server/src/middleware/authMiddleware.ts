import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Defining a custom Request type by extending the express Request type
interface CustomRequest extends Request {
  userId?: string; 
}

const protect = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Verify Token
    const verified: any = jwt.verify(token, process.env.JWT_SECRET || '');

    // Set the user ID on the request object
    req.userId = verified.id;

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
};

export default protect;
