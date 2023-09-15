import express, { Request, Response, Router } from 'express';
import { registerUser, loginUser, logoutUser, followUser, unfollowUser, getUser, getUserById } from '../controllers/userController';
import protect from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getuser', protect, getUser);
router.get('/userprofile/:id',protect, getUserById);
router.patch('/follow/:id',protect, followUser);
router.patch('/unfollow/:id',protect, unfollowUser);

export default router;
