import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
};

// Register User
const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, userName, email, password } = req.body;

    // Registration Validation
    if (!name || !userName || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be up to 6 characters');
    }

    // Check if user email already exists
    const userExists = await User.findOne({ email });
    const userNameExists = await User.findOne({ userName });

    if (userNameExists) {
      res.status(400);
      throw new Error('userName has already been registered');
    }

    // Create new user
    const user = await User.create({
      name,
      userName,
      email,
      password,
    });

    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: 'none',
      secure: true,
    });

    if (user) {
      const { _id, name, userName, email, photo } = user;
      res.status(201).json({
        _id,
        name,
        userName,
        email,
        photo,
        token,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// +++++++++++ Login User ++++++++++++++++++++++
const loginUser = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;

    // Validate Request
    if (!userName || !password) {
      res.status(400);
      throw new Error('Please add email and password');
    }

    // Check if user exists
    const user = await User.findOne({ userName });

    if (!user) {
      res.status(400);
      throw new Error('User not found, please signup');
    }

    // User exists, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    // Generate Tokens
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: 'none',
      secure: true,
    });

    if (user && passwordIsCorrect) {
      const { _id, name, userName, email, photo } = user;
      res.status(200).json({
        _id,
        name,
        userName,
        email,
        photo,
        token,
      });
    } else {
      res.status(400);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Logout User
const logoutUser = async (req: Request, res: Response) => {
  try {
    res.cookie('token', '', {
      path: '/',
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'none',
      secure: true,
    });
    return res.status(200).json({ message: 'Successfully Logged Out' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// // Get User Data
// const getUser = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findById(req.user?._id);

//     if (user) {
//       const { _id, name, userName, email, photo } = user;
//       res.status(200).json({
//         _id,
//         name,
//         userName,
//         email,
//         photo,
//       });
//     } else {
//       res.status(400);
//       throw new Error('User Not Found');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// // Update User
// const updateUser = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findById(req.user?._id);

//     if (user) {
//       const { name, userName, email, photo } = user;
//       user.userName = userName;
//       user.email = email;
//       user.name = req.body.name || name;
//       user.photo = req.body.photo || photo;

//       const updatedUser = await user.save();
//       res.status(200).json({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         userName: updatedUser.userName,
//         email: updatedUser.email,
//         photo: updatedUser.photo,
//       });
//     } else {
//       res.status(404);
//       throw new Error('User not found');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

export { registerUser, loginUser, logoutUser};
