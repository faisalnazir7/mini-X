import express, { Request, Response, Router } from 'express';
import { createPost, deletePost, getAllPosts, updatePost } from '../controllers/postController';
import protect from '../middleware/authMiddleware';


const router: Router = express.Router();

router.post('/create',protect, createPost);
router.get('/getposts',protect, getAllPosts);
router.patch('/updatepost/:id',protect, updatePost);
router.delete('/deletepost/:id',protect, deletePost);

export default router;
