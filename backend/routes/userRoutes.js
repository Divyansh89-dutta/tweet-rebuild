import express from 'express';
import { getUserProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddlewars.js';
import { followUser, unfollowUser } from '../controllers/userController.js';

const router = express.Router();

// Get user profile by username
router.get('/profile', protect, getUserProfile);

// Follow a user / unfollow a user
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

export default router;