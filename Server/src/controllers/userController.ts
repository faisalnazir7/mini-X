import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
};

interface CustomRequest extends Request {
  userId?: string;
}

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
    const { userName: inputUserName, password } = req.body;

    // Validate Request
    if (!inputUserName || !password) {
      return res.status(400).json({ error: 'Please provide a username and password' });
    }

    // Check if user exists
    const user: IUser | null = await User.findOne({ userName: inputUserName });

    if (!user) {
      return res.status(400).json({ error: 'User not found, please sign up' });
    }

    // User exists, check if password is correct
    const passwordIsCorrect: boolean = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate Tokens
    const token: string = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: 'none',
      secure: true,
    });

    const { _id, name, userName, email, photo } = user;
    res.status(200).json({
      _id,
      name,
      userName,
      email,
      photo,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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

//Get current user
const getUser = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (user) {
      const { _id, name, userName, email, photo, followers, following } = user;
      res.status(200).json({
        _id,
        name,
        userName,
        email,
        photo,
        followers,
        following,
      });
    } else {
      res.status(400).json({ error: 'User Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//get user by id
const getUserById = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.id;
    const user: IUser | null = await User.findById(userId);

    if (user) {
      const { _id, name, userName, email, photo, followers, following } = user;
      res.status(200).json({
        _id,
        name,
        userName,
        email,
        photo,
        followers,
        following,
      });
    } else {
      res.status(404).json({ error: 'User Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Follow users
const followUser = async (req: CustomRequest, res: Response) => {
  try {
    const followId: string = req.params.id;

    // Update the user being followed
    const updatedUserFollowing: IUser | null = await User.findByIdAndUpdate(
      followId,
      {
        $push: { followers: req.userId },
      },
      {
        new: true,
      }
    );

    if (!updatedUserFollowing) {
      return res.status(404).json({ error: 'User being followed not found' });
    }

    // Update the current user
    const updatedCurrentUser: IUser | null = await User.findByIdAndUpdate(
      req.userId,
      {
        $push: { following: followId },
      },
      {
        new: true,
      }
    );

    if (!updatedCurrentUser) {
      return res.status(404).json({ error: 'Current user not found' });
    }

    res.json(updatedCurrentUser);
  } catch (error) {
    console.error(error);
    res.status(422).json( 'Internal Server Error' );
  }
};

const unfollowUser = async (req: CustomRequest, res: Response) => {
  try {
    const unfollowId: string = req.params.id;

    // Update the user being unfollowed
    const updatedUserFollowers: IUser | null = await User.findByIdAndUpdate(
      unfollowId,
      {
        $pull: { followers: req.userId },
      },
      {
        new: true,
      }
    );

    if (!updatedUserFollowers) {
      return res.status(404).json({ error: 'User being unfollowed not found' });
    }

    // Update the current user
    const updatedCurrentUser: IUser | null = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: { following: unfollowId },
      },
      {
        new: true,
      }
    );

    if (!updatedCurrentUser) {
      return res.status(404).json({ error: 'Current user not found' });
    }

    res.json(updatedCurrentUser);
  } catch (error) {
    console.error(error);
    res.status(422).json('Internal Server Error');
  }
};


export { registerUser, loginUser, logoutUser,getUser, getUserById, followUser, unfollowUser };
