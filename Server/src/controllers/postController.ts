import { Request, Response } from 'express';
import PostModel from '../models/postModel'; // Import the IPost interface
import IPost from '../models/postModel'; // Import the IPost interface

interface CustomRequest extends Request {
  userId?: string;
}

// Create a new post
const createPost = async (req: CustomRequest, res: Response) => {
  try {
    const { body, photo, video } = req.body;

    // Create a new post
    const post = new PostModel({
      body,
      photo,
      video,
      likes: [],
      comments: [],
      postedBy: req.userId,
    });

    // Save the post to the database
    await post.save();

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all posts
const getAllUserPosts = async (req: CustomRequest, res: Response) => {
    try {
      // Retrieve all contacts from the database
      const posts = await PostModel.find({ postedBy: req.userId });
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ error: 'Posts not found' });
      }
  
      res.status(200).json({ posts });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Update a post by ID
const updatePost = async (req: CustomRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const { body, photo, video } = req.body;

    // Find the post by ID
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is authorized to update the post (you may want to implement this logic)
    if (post.postedBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to update this post' });
    }

    // Update the post
    post.body = body;
    post.photo = photo;
    post.video = video;

    // Save the updated post
    await post.save();

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a post by ID
const deletePost = async (req: CustomRequest, res: Response) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is authorized to delete the post (you may want to implement this logic)
    if (post.postedBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    // Delete the post
    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Like a post (PATCH request)
const likePost = async (req: CustomRequest, res: Response) => {
    try {
      const postId = req.params.id;
      const userId = req.userId;
  
      // Find the post by ID
      const post = await PostModel.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the user has already liked the post
      if (post.likes.includes(userId)) {
        return res.status(400).json({ error: 'You have already liked this post' });
      }
  
      // Add the user's ID to the likes array
      post.likes.push(userId);
  
      // Save the updated post
      await post.save();
  
      res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  // Unlike a post
  const unlikePost = async (req: CustomRequest, res: Response) => {
    try {
      const postId = req.params.id;
      const userId = req.userId;
  
      // Find the post by ID
      const post = await PostModel.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the user has liked the post
      if (!post.likes.includes(userId)) {
        return res.status(400).json({ error: 'You have not liked this post' });
      }
  
      // Remove the user's ID from the likes array
      const updatedLikes = post.likes.filter((likedUserId) => likedUserId.toString() !== userId);
  
      // Update the post's likes with the new array
      post.likes = updatedLikes;
  
      // Save the updated post
      await post.save();
  
      res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

export { createPost, getAllUserPosts, updatePost, deletePost, likePost, unlikePost };
