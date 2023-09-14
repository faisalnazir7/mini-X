import express, { Request, Response, Router } from 'express';
import { createPost, deletePost, getAllUserPosts, likePost, unlikePost, updatePost } from '../controllers/postController';
import protect from '../middleware/authMiddleware';


const router: Router = express.Router();

router.post('/create',protect, createPost);
router.get('/getposts',protect, getAllUserPosts);
router.patch('/updatepost/:id',protect, updatePost);
router.delete('/deletepost/:id',protect, deletePost);
router.patch('/like/:id',protect, likePost);
router.patch('/unlike/:id',protect, unlikePost);

export default router;
